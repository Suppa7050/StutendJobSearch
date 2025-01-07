from django.db import models
from django.contrib.auth.models import User

from django.db import models




class Company(models.Model):
    email=models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def _str_(self):
        return self.name


class Job(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    job_name = models.CharField(max_length=100)
    job_role = models.CharField(max_length=100)
    job_description = models.TextField()
    salary=models.FloatField()
    experience=models.FloatField()
    type=models.CharField(max_length=100)
    last_date = models.DateField()
    def _str_(self):
        return self.job_name
class RequiredSkills(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='required_skills')
    mandatory_flag=models.BooleanField()
    skill_name = models.CharField(max_length=100)  # New field for the skill name
    

class Question(models.Model):
    job = models.ForeignKey(Job, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()

    def _str_(self):
        return self.question_text


from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from users.models import StudentUser

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected')
    ]
    student_id = models.IntegerField()
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def _str_(self):
        return f"Application {self.id} - {self.status}"

    def send_status_update_email(self):
        print(f"Preparing to send email for application {self.id} with status {self.status}")

        if self.status == 'accepted':
            subject = 'Congratulations! Your Application Has Been Accepted'
            html_content = render_to_string('emails/application_accepted.html', {'job_name': self.job.job_name})
        elif self.status == 'rejected':
            subject = 'Application Status Update'
            html_content = render_to_string('emails/application_rejected.html', {'job_name': self.job.job_name})
        else:
            return

        plain_message = strip_tags(html_content)  # Plain-text version for email clients that don't support HTML

        # Retrieve the student's email based on the student_id
        recipient_email = self.get_student_email()
        print(recipient_email)
        if recipient_email:
            print(f"Sending email to {recipient_email}...")
            email = EmailMultiAlternatives(
                subject,
                plain_message,  # Plain-text version
                settings.DEFAULT_FROM_EMAIL,
                [recipient_email],
                headers={'Reply-To': settings.DEFAULT_FROM_EMAIL}  # Optional: Add a Reply-To header
            )
            email.attach_alternative(html_content, "text/html")  # Attach the HTML version
            email.send()
        else:
            print(f"No email found for student with ID {self.student_id}")

    def get_student_email(self):
        try:
            student = StudentUser.objects.get(id=self.student_id)
            return student.email
        except StudentUser.DoesNotExist:
            print(f"Student with ID {self.student_id} not found.")
            return None




from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Application)
def send_status_email_on_update(sender, instance, **kwargs):
    if instance.status in ['accepted', 'rejected']:
        instance.send_status_update_email()


# class Application(models.Model):
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('reviewed', 'Reviewed'),
#         ('accepted', 'Accepted'),
#         ('rejected', 'Rejected')
#     ]
#     student_id = models.IntegerField()  # Assume this is an integer; adjust as needed
#     job = models.ForeignKey(Job, on_delete=models.CASCADE)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

#     def _str_(self):
#         return f"Application {self.id} - {self.status}"

class Answer(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.TextField()

    def _str_(self):
        return f"Answer {self.id} for Application {self.application_id}"