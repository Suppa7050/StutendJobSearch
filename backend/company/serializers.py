#by suppa


# users/serializers.py

from rest_framework import serializers
from .models import Job, Question,Company,Application, Answer,RequiredSkills

# class QuestionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Question
#         fields = ['question_text']

# class JobSerializer(serializers.ModelSerializer):
#     questions = QuestionSerializer(many=True)

#     class Meta:
#         model = Job
#         fields = ['job_id', 'job_name', 'job_role', 'job_description', 'last_date', 'questions']

#     def create(self, validated_data):
#         questions_data = validated_data.pop('questions')
#         job = Job.objects.create(**validated_data)
#         for question_data in questions_data:
#             Question.objects.create(job=job, **question_data)
#         return job


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text']  # Including id for better identification

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['name', 'location']


# serializers.py
'''
class JobSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company', write_only=True)
    company = serializers.StringRelatedField(read_only=True)
    company_details = serializers.SerializerMethodField()
    required_skills = RequiredSkillsSerializer(many=True, write_only=True)  # Adding required skills

    class Meta:
        model = Job
        fields = ['job_name', 'job_role', 'job_description', 'last_date', 'questions', 'experience', 'type', 'salary', 
                  'company_id', 'company', 'company_details', 'required_skills']

    def get_company_details(self, obj):
        return {
            'name': obj.company.name,
            'location': obj.company.location
        }

    def create(self, validated_data):
        questions_data = self.context['request'].data.get('questions', [])
        skills_data = validated_data.pop('required_skills', [])  # Extract skills data
        company = validated_data.pop('company')
        
        job = Job.objects.create(**validated_data, company=company)

        for question_data in questions_data:
            Question.objects.create(job=job, **question_data)
        
        # Create skills linked to the job
        for skill_data in skills_data:
            RequiredSkills.objects.create(job=job, **skill_data)
        
        return job
'''

class AnswerSerializer(serializers.ModelSerializer):
    # For reading: Include question details; For writing: Expect question_id from frontend
    question = QuestionSerializer(read_only=True)  
    question_id = serializers.PrimaryKeyRelatedField(
        queryset=Question.objects.all(), source='question', write_only=True
    )

    class Meta:
        model = Answer
        fields = ['id', 'question', 'question_id', 'answer_text']

class ApplicationSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)  # For handling multiple answers at once
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), source='job')  # Link to Job model

    class Meta:
        model = Application
        fields = ['id', 'student_id', 'job_id', 'status', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        application = Application.objects.create(**validated_data)
        
        for answer_data in answers_data:
            Answer.objects.create(application=application, **answer_data)
        
        return application

class RequiredSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequiredSkills
        fields = ['skill_name', 'mandatory_flag']



class JobSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    required_skills = RequiredSkillsSerializer(many=True)  # Add required_skills

    company_id = serializers.PrimaryKeyRelatedField(queryset=Company.objects.all(), source='company', write_only=True)
    company = serializers.StringRelatedField(read_only=True)
    company_details = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'job_name', 'job_role', 'job_description', 'last_date', 'experience', 'type', 'salary',
            'company_id', 'company', 'company_details', 'questions', 'required_skills',
        ]

    def get_company_details(self, obj):
        return {'name': obj.company.name, 'location': obj.company.location}

    def create(self, validated_data):
        questions_data = self.context['request'].data.get('questions', [])
        required_skills_data = validated_data.pop('required_skills', [])
        company = validated_data.pop('company')

        job = Job.objects.create(company=company, **validated_data)

        for question_data in questions_data:
            Question.objects.create(job=job, **question_data)

        for skill_data in required_skills_data:
            RequiredSkills.objects.create(job=job, **skill_data)

        return job