from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from .models import Job
from users.models import StudentUser  # Assuming StudentUser model is in users app


# Utility function to remove non-ASCII characters by slicing
def remove_non_ascii(text):
    return ''.join([char for char in text if ord(char) < 128])


@receiver(post_save, sender=Job)
def send_job_notification(sender, instance, created, **kwargs):
    if created:
        print("send_job_notification signal triggered for a new job post.")

        job = instance

        # Normalize all dynamic strings to ensure compatibility
        job_name = remove_non_ascii(job.job_name)
        company_name = remove_non_ascii(job.company.name)
        company_location = remove_non_ascii(job.company.location)
        job_role = remove_non_ascii(job.job_role)

        subject = f"New Job Opportunity: {job_name} at {company_name}"
        subject=remove_non_ascii(subject)
        # Create the job link using localhost (adjust port as needed)
        job_link = f"http://localhost:3000/jobs/{job.id}"  # Directs to the specific job based on job.id

        # HTML message for better styling
        html_message = f"""
        <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <div style="background-color: #f7f7f7; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">🚀 New Job Opportunity Just for You!</h2>
                    <p style="font-size: 16px;">
                        A new job has been posted that might match your skills and experience. Check it out below:
                    </p>
                    <div style="background-color: #ffffff; border: 1px solid #e0e0e0; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #0073e6;">{job_name}</h3>
                        <p style="font-size: 15px;">
                            <strong>Company:</strong> {company_name} <br>
                            <strong>Location:</strong> {company_location} <br>
                            <strong>Job Role:</strong> {job_role} <br>
                            <strong>Experience Required:</strong> {job.experience} years <br>
                            <strong>Salary:</strong> ₹{job.salary}
                        </p>
                        <p>
                            <a href="{job_link}" style="background-color: #0073e6; color: #ffffff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 16px;">View Job and Apply</a>
                        </p>
                    </div>
                    <p style="font-size: 14px; color: #666;">
                        Best of luck with your job search!
                    </p>
                </div>
            </body>
        </html>
        """

        # Plain text version for email clients that don’t support HTML
        text_message = f"""
        New Job Opportunity: {job_name}
        Company: {company_name}
        Location: {company_location}
        Job Role: {job_role}
        Experience Required: {job.experience} years
        Salary: ₹{job.salary}
        Apply here: {job_link}
        """
        text_message=remove_non_ascii(text_message)
        # Send email to each registered user
        for student in StudentUser.objects.all():
            try:
                email = student.email
                email_message = EmailMultiAlternatives(subject, text_message, settings.DEFAULT_FROM_EMAIL, [email])
                email_message.attach_alternative(html_message, "text/html; charset=UTF-8")
                email_message.send()
                print(f"Notification sent to {email}")
            except Exception as e:
                print(f"Failed to send notification to {email}. Error: {str(e)}")
