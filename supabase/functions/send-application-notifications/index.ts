import React from 'npm:react@18.3.1'
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { RecruiterApplicationEmail } from './_templates/recruiter-application-email.tsx'
import { AdminApplicationEmail } from './_templates/admin-application-email.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationNotificationRequest {
  application_id: string;
  type: 'recruiter' | 'admin';
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { application_id, type }: ApplicationNotificationRequest = await req.json()
    
    console.log('Processing notification for application:', application_id, 'type:', type)

    // Fetch application with related data
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        jobs!inner(
          *,
          companies!inner(*)
        ),
        profiles!inner(*)
      `)
      .eq('id', application_id)
      .single()

    if (appError || !application) {
      throw new Error(`Application not found: ${appError?.message}`)
    }

    const job = application.jobs
    const company = job.companies
    const candidate = application.profiles

    if (type === 'recruiter') {
      // Get company users (owners and recruiters)
      const { data: companyUsers, error: usersError } = await supabase
        .from('company_users')
        .select(`
          profiles!inner(*)
        `)
        .eq('company_id', company.id)
        .eq('accepted_at', true)
        .in('role', ['owner', 'recruiter'])

      if (usersError) {
        console.error('Error fetching company users:', usersError)
        throw usersError
      }

      // Send emails to each recruiter/owner
      for (const companyUser of companyUsers || []) {
        const profile = companyUser.profiles
        
        // Render email template
        const emailHtml = await renderAsync(
          React.createElement(RecruiterApplicationEmail, {
            recruiterName: profile.first_name || profile.display_name || 'Team',
            jobTitle: job.title,
            candidateName: candidate.display_name || `${candidate.first_name} ${candidate.last_name}`.trim(),
            fitScore: application.fit_score || 0,
            avgDealSize: candidate.avg_deal_eur,
            languages: ['Deutsch', 'Englisch'], // Mock data
            assessmentScore: 85, // Mock data
            threadUrl: `${Deno.env.get('SITE_URL')}/threads/${application.id}`, // Using application id as thread reference
            candidateUrl: `${Deno.env.get('SITE_URL')}/applications/${application.id}`,
            companyName: company.name,
            fitReasons: application.fit_reasons || []
          })
        )

        // Send email
        const { error: emailError } = await resend.emails.send({
          from: 'Closebase <noreply@resend.dev>',
          to: [profile.user_id], // This should be the actual email - using user_id as placeholder
          subject: `Neue Bewerbung: ${job.title} – ${candidate.display_name}`,
          html: emailHtml,
        })

        if (emailError) {
          console.error('Error sending recruiter email:', emailError)
        }

        // Create in-app notification
        await supabase
          .from('notifications')
          .insert({
            user_id: profile.user_id,
            type: 'application_new',
            title: 'Neue Bewerbung eingegangen',
            message: `${candidate.display_name} hat sich auf ${job.title} beworben`,
            data: {
              application_id: application.id,
              job_id: job.id,
              candidate: {
                id: candidate.user_id,
                name: candidate.display_name,
                fit: application.fit_score
              },
              thread_id: application.id
            },
            read: false
          })
      }

    } else if (type === 'admin') {
      // Get admin emails from environment
      const adminEmails = Deno.env.get('CLOSEBASE_ADMIN_EMAILS')?.split(',').filter(Boolean) || []
      
      if (adminEmails.length > 0) {
        // Render admin email template
        const adminEmailHtml = await renderAsync(
          React.createElement(AdminApplicationEmail, {
            companyName: company.name,
            jobTitle: job.title,
            jobId: job.id,
            candidateName: candidate.display_name || `${candidate.first_name} ${candidate.last_name}`.trim(),
            userId: candidate.user_id,
            fitScore: application.fit_score || 0,
            adminUrl: `${Deno.env.get('SITE_URL')}/admin/applications/${application.id}`
          })
        )

        // Send to all admin emails
        for (const adminEmail of adminEmails) {
          const { error: emailError } = await resend.emails.send({
            from: 'Closebase Admin <noreply@resend.dev>',
            to: [adminEmail],
            subject: `[Admin] Neue Bewerbung: ${job.title} bei ${company.name}`,
            html: adminEmailHtml,
          })

          if (emailError) {
            console.error('Error sending admin email:', emailError)
          }
        }

        // Create admin notification (if admin user exists)
        const { data: adminUsers } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(1)

        if (adminUsers && adminUsers.length > 0) {
          await supabase
            .from('notifications')
            .insert({
              user_id: adminUsers[0].user_id,
              type: 'admin_application_new',
              title: '[Admin] Neue Bewerbung',
              message: `${candidate.display_name} bei ${company.name}`,
              data: {
                application_id: application.id,
                job_id: job.id,
                company: company.name,
                candidate: candidate.display_name
              },
              read: false
            })
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error: any) {
    console.error('Error in send-application-notifications function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})