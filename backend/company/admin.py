from django.contrib import admin
from .models import Job, Question, Answer, Application, Company, RequiredSkills

class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_name', 'job_role', 'company', 'last_date')
    search_fields = ('job_name', 'job_role')
    list_filter = ('company', 'last_date')

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'question_text')
    search_fields = ('question_text',)
    list_filter = ('job',)

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_id', 'job', 'status')
    search_fields = ('student_id',)
    list_filter = ('status', 'job')

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'application', 'question', 'answer_text')
    search_fields = ('answer_text',)
    list_filter = ('application', 'question')

class RequiredSkillsAdmin(admin.ModelAdmin):
    list_display = ('id', 'job', 'skill_name', 'mandatory_flag')  # Add skill_name field
    search_fields = ('skill_name',)
    list_filter = ('mandatory_flag', 'job')

# Register models with the admin site
admin.site.register(Job, JobAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Company)
admin.site.register(RequiredSkills, RequiredSkillsAdmin)
