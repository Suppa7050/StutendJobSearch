from django.db import models

class StudentUser(models.Model):
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    mobile = models.CharField(max_length=15, null=True, blank=True)
    linkedin=models.URLField(blank=True, null=True)
    github=models.URLField(blank=True, null=True)

    def __str__(self):
        return self.email

class Address(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='address', on_delete=models.CASCADE)
    address_line_1 = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return f'{self.address_line_1}, {self.city}'

class Certificate(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='certificates', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    issuing_organization=models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title
class Skills(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='skills', on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=255)

class Experience(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='experiences', on_delete=models.CASCADE)
    employer = models.CharField(max_length=255)
    location = models.CharField(max_length=100, blank=True, null=True)
    role_title = models.CharField(max_length=100)
    duration_from = models.DateField(blank=True, null=True)
    duration_to = models.DateField(blank=True, null=True)
    current = models.BooleanField(default=False)  # New field for ongoing status
    description = models.TextField(blank=True, null=True)
    skills = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.role_title

class Project(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    duration_from = models.DateField(blank=True, null=True)
    duration_to = models.DateField(blank=True, null=True)
    current = models.BooleanField(default=False)  # New field for ongoing status
    description = models.TextField(blank=True, null=True)
    skills = models.CharField(max_length=300, blank=True, null=True)
    link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class Education(models.Model):
    user_profile = models.ForeignKey(StudentUser, related_name='education', on_delete=models.CASCADE)
    institute_name = models.CharField(max_length=200)
    degree_name=models.CharField(max_length=200)
    specialization = models.CharField(max_length=200)
    duration_from = models.DateField(blank=True, null=True)
    duration_to = models.DateField(blank=True, null=True)
    current = models.BooleanField(default=False)  # New field for ongoing status
    marks_or_grade = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.institute_name






from django.db import models
from django.conf import settings
import os

def resume_upload_path(instance, filename):
    # Extract the file extension
    extension = os.path.splitext(filename)[1]
    # Format the filename as student_id.extension
    filename = f"{instance.user_profile.id}{extension}"
    # Return the path where the file will be saved
    return os.path.join('resumes', filename)


class Resume(models.Model):
    user_profile = models.ForeignKey(StudentUser, on_delete=models.CASCADE, related_name="resumes")
    file = models.FileField(upload_to=resume_upload_path,default=None)  # Use the custom upload path
    uploaded_at = models.DateTimeField(auto_now_add=True)



# users/models.py
# from django.db import models
# from .models import StudentUser

# def resume_upload_path(instance, filename):
#     # This will save the file as resumes/<student_id>.pdf or <student_id>.docx, depending on the original file extension
#     extension = filename.split('.')[-1]
#     return f"resumes/{instance.user_profile.id}.{extension}"

# class Resume(models.Model):
#     user_profile = models.ForeignKey(StudentUser, related_name='resumes', on_delete=models.CASCADE)
#     file = models.FileField(upload_to=resume_upload_path, blank=True, null=True)  # Set custom upload path here

#     def __str__(self):
#         return f'Resume for {self.user_profile.email}'


# class Resume(models.Model):
#     user_profile = models.ForeignKey(StudentUser, related_name='resumes', on_delete=models.CASCADE)
#     pdf_file = models.FileField(upload_to='resumes/', blank=True, null=True)  # Field for PDF file upload

#     def __str__(self):
#         return f'Resume for {self.user_profile.email}'