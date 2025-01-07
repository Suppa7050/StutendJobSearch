from django.views.decorators.http import require_http_methods
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from .models import Skills, StudentUser, Address, Certificate, Experience, Project, Education
from django.contrib.auth.hashers import make_password,check_password
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  status
from django.views.decorators.csrf import csrf_exempt
import json


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Capture form data from request
        email = request.data.get('email')
        password = request.data.get('password')
        re_enter_password = request.data.get('reEnterPassword')
        first_name = request.data.get('firstName')
        middle_name = request.data.get('middleName', '')  # Optional
        last_name = request.data.get('lastName')
        gender = request.data.get('gender', '')  # Optional
        mobile = request.data.get('mobile', '')  # Optional
        linkedin=request.data.get('linkedin', '')
        github=request.data.get('github', '')

        # Validate required fields
        if not email or not password or not first_name or not last_name:
            return Response({'error': 'Email, password, first name, and last name are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure password match
        if password != re_enter_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user with this email already exists
        if StudentUser.objects.filter(email=email).exists():
            return Response({'error': 'User already exists with this email address.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        hashed_password = make_password(password)
        user = StudentUser.objects.create(
            email=email,
            password=hashed_password,
            first_name=first_name,
            middle_name=middle_name,
            last_name=last_name,
            linkedin=linkedin,
            github=github,
            gender=gender,
            mobile=mobile
        )
        user.save()

        # Include the ID of the created user in the response
        return Response({'message': 'User registered successfully', 'userId': user.id}, status=status.HTTP_201_CREATED)



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email,password)
        # Check if both email and password are provided
        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Check if the user with the provided email exists
            user = StudentUser.objects.get(email=email)
        except StudentUser.DoesNotExist:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)

        # Verify the password using check_password
        if check_password(password, user.password):
            # If authentication is successful, return success message
            return JsonResponse({
                'message': 'Login successful',
                'user': {
                    'id':user.id,
                    'email': user.email

                }
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid email or password.'}, status=401)




@csrf_exempt
@require_http_methods(["GET", "PUT"])
def user_profile(request, id):
    user = get_object_or_404(StudentUser, id=id)

    if request.method == "GET":
    # Create a dictionary for personal information
        personal_info = {
            'email': user.email,
            'first_name': user.first_name,
            'middle_name': user.middle_name,
            'last_name': user.last_name,
            'gender': user.gender,
            'mobile': user.mobile,
            'address': list(user.address.values()) if hasattr(user, 'address') else []  # Optional address
        }

        # Collect additional user-related data
        additional_data = {
            'certificates': list(user.certificates.values()) if hasattr(user, 'certificates') else [],
            'experiences': list(user.experiences.values()) if hasattr(user, 'experiences') else [],
            'projects': list(user.projects.values()) if hasattr(user, 'projects') else [],
            'education': list(user.education.values()) if hasattr(user, 'education') else [],
            'skills': list(user.skills.values()) if hasattr(user, 'skills') else [],
            'resume': {
            'id': user.resume.id,
            'pdf_file': user.resume.pdf_file.url  # Assuming pdf_file is a FileField in Resume model
        } if hasattr(user, 'resume') else None  # Checks if resume exists
        }

        # Combine personal information with additional data
        user_data = {
            'personal_info': personal_info,
            **additional_data  # Unpacking additional data into the user_data dictionary
        }

        return JsonResponse(user_data)


    elif request.method == "PUT":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)

            # Update fields while preventing email from being changed
            user.first_name = data.get('first_name', user.first_name)
            user.middle_name = data.get('middle_name', user.middle_name)
            user.last_name = data.get('last_name', user.last_name)
            user.gender = data.get('gender', user.gender)
            user.mobile = data.get('mobile', user.mobile)

            # Save the updated user object
            user.save()

            # Prepare the response data
            updated_info = {
                'email': user.email,
                'first_name': user.first_name,
                'middle_name': user.middle_name,
                'last_name': user.last_name,
                'gender': user.gender,
                'mobile': user.mobile,
                'address': list(user.address.values()) if hasattr(user, 'address') else []
            }

            return JsonResponse({'personal_info': updated_info}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@csrf_exempt
def get_user_profile(request, id):
    print(id)
    user = get_object_or_404(StudentUser, id=id)
    
    # Create a dictionary for personal information
    personal_info = {
        'email': user.email,
        'first_name': user.first_name,
        'middle_name': user.middle_name,
        'last_name': user.last_name,
        'gender': user.gender,
        'mobile': user.mobile,
        'linkedin':user.linkedin,
        'github':user.github,
        'address': list(user.address.values()) if hasattr(user, 'address') else []  # Optional address
    }
    
    # Collect additional user-related data with current status logic
    additional_data = {
        'certificates': list(user.certificates.values()) if hasattr(user, 'certificates') else [],
        'experiences': [
            {
                'id': exp.id,
                'employer': exp.employer,
                'role_title': exp.role_title,
                'duration_from': exp.duration_from,
                'duration_to': "Present" if exp.current else exp.duration_to,
                'description': exp.description,
                'skills': exp.skills
            } for exp in user.experiences.all()
        ],
        'projects': list(user.projects.values()) if hasattr(user, 'projects') else [],
        'education': [
            {
                'id': edu.id,
                'institute_name': edu.institute_name,
                'duration_from': edu.duration_from,
                'duration_to': "Present" if edu.current else edu.duration_to,
                'marks_or_grade': edu.marks_or_grade
            } for edu in user.education.all()
        ],
    }

    # Combine personal information with additional data
    user_data = {
        'personal_info': personal_info,
        **additional_data  # Unpacking additional data into the user_data dictionary
    }

    return JsonResponse(user_data)



@csrf_exempt
def delete_user_profile(request, id):
    user = get_object_or_404(StudentUser, id=id)
    user.delete()
    return JsonResponse({'message': 'User profile deleted successfully'}, status=200)


@csrf_exempt
def update_address(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        # Update or create based solely on user_profile
        address, created = Address.objects.update_or_create(
            user_profile=user_profile,
            defaults={  # Set all address fields here as defaults
                'address_line_1': data.get('address_line_1', ''),
                'city': data.get('city', ''),
                'state': data.get('state', ''),
                'pincode': data.get('pincode', ''),
            }
        )
        
        if created:
            return JsonResponse({'message': 'Address created successfully'}, status=201)
        else:
            return JsonResponse({'message': 'Address updated successfully'}, status=200)

    return HttpResponse(status=405)  # Method not allowed for other HTTP methods

    

@csrf_exempt
def manage_certificate(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)
    
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        certificate = Certificate.objects.create(
            user_profile=user_profile,
            title=data['title'],
            issuing_organization=data['issuing_organization'],
            description=data['description'],
            file_link=data['file_link']
        )
        return JsonResponse({'message': 'Certificate added successfully', 'id': certificate.id})
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        certificate = get_object_or_404(Certificate, id=data['id'])
        certificate.title = data.get('title', certificate.title)
        certificate.description = data.get('description', certificate.description)
        certificate.file_link = data.get('file_link', certificate.file_link)
        certificate.issuing_organization = data.get('issuing_organization', certificate.issuing_organization)
        certificate.save()
        return JsonResponse({'message': 'Certificate updated successfully'})

    elif request.method == 'DELETE':
        data = json.loads(request.body)
        certificate = get_object_or_404(Certificate, id=data['id'])
        certificate.delete()
        return JsonResponse({'message': 'Certificate deleted successfully'})
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json

from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import StudentUser, Experience, Project, Education
import json
from datetime import datetime

# Helper function to parse dates
def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d') if date_str else None
    except ValueError:
        return None

# ------------------------- Manage Experience ------------------------- #
@csrf_exempt
def manage_experience(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            employer = data.get('employer')
            if not employer:
                return JsonResponse({'error': 'Employer is required'}, status=400)
            
            role_title = data.get('role_title')
            if not role_title:
                return JsonResponse({'error': 'Role title is required'}, status=400)

            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))
            current = duration_to == datetime(1800, 1, 1)  # Check if ongoing
            experience = Experience.objects.create(
                user_profile=user_profile,
                employer=employer,
                location=data.get('location', ''),
                role_title=role_title,
                duration_from=duration_from,
                duration_to=duration_to,
                current=current,
                description=data.get('description', ''),
                skills=data.get('skills', '')
            )
            return JsonResponse({'message': 'Experience added successfully', 'id': experience.id})

        elif request.method == 'PUT':
            experience = get_object_or_404(Experience, id=data['id'])

            experience.employer = data.get('employer', experience.employer)
            experience.location = data.get('location', experience.location)
            experience.role_title = data.get('role_title', experience.role_title)
            experience.duration_from = parse_date(data.get('duration_from')) or experience.duration_from
            experience.current = experience.duration_to == datetime(1800, 1, 1)  # Update current status
            experience.duration_to = parse_date(data.get('duration_to')) or experience.duration_to
            experience.description = data.get('description', experience.description)
            experience.skills = data.get('skills', experience.skills)
            experience.save()
            return JsonResponse({'message': 'Experience updated successfully'})

        elif request.method == 'DELETE':
            experience = get_object_or_404(Experience, id=data['id'])
            experience.delete()
            return JsonResponse({'message': 'Experience deleted successfully'})

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Experience.DoesNotExist:
        return JsonResponse({'error': 'Experience record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ------------------------- Manage Project ------------------------- #
@csrf_exempt
def manage_project(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            title = data.get('title')
            if not title:
                return JsonResponse({'error': 'Title is required'}, status=400)

            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))
            current = duration_to == datetime(1800, 1, 1)  # Check if ongoing
            project = Project.objects.create(
                user_profile=user_profile,
                title=title,
                duration_from=duration_from,
                duration_to=duration_to,
                description=data.get('description', ''),
                skills=data.get('skills', ''),
                link=data.get('link', ''),
                current=current
            )

            return JsonResponse({'message': 'Project added successfully', 'id': project.id})

        elif request.method == 'PUT':
            project = get_object_or_404(Project, id=data['id'])
            project.title = data.get('title', project.title)
            project.duration_from = parse_date(data.get('duration_from')) or project.duration_from
            project.duration_to = parse_date(data.get('duration_to')) or project.duration_to
            project.description = data.get('description', project.description)
            project.current = project.duration_to == datetime(1800, 1, 1)  # Update current status
            project.skills = data.get('skills', project.skills)
            project.link = data.get('link', project.link)
            project.save()
            return JsonResponse({'message': 'Project updated successfully'})

        elif request.method == 'DELETE':
            project = get_object_or_404(Project, id=data['id'])
            project.delete()
            return JsonResponse({'message': 'Project deleted successfully'})

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Project.DoesNotExist:
        return JsonResponse({'error': 'Project record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# ------------------------- Manage Education ------------------------- #
@csrf_exempt
def manage_education(request, id):
    user_profile = get_object_or_404(StudentUser, id=id)

    try:
        data = json.loads(request.body)

        if request.method == 'POST':
            institute_name = data.get('institute_name')
            if not institute_name:
                return JsonResponse({'error': 'Institute name is required'}, status=400)
            degree_name = data.get('degree_name')
            specialization=data.get('specialization')
            duration_from = parse_date(data.get('duration_from'))
            duration_to = parse_date(data.get('duration_to'))

            education = Education.objects.create(
                user_profile=user_profile,
                institute_name=institute_name,
                degree_name=degree_name,
                specialization=specialization,
                duration_from=duration_from,
                duration_to=duration_to,
                marks_or_grade=data.get('marks_or_grade', '')
            )
            return JsonResponse({'message': 'Education added successfully', 'id': education.id}, status=201)

        elif request.method == 'PUT':
            education = get_object_or_404(Education, id=data['id'])
            education.institute_name = data.get('institute_name', education.institute_name)
            education.duration_from = parse_date(data.get('duration_from')) or education.duration_from
            education.duration_to = parse_date(data.get('duration_to')) or education.duration_to
            specialization=data.get('specialization', education.specialization),
            degree_name=data.get('degree_name', education.degree_name),
            education.marks_or_grade = data.get('marks_or_grade', education.marks_or_grade)
            education.save()
            return JsonResponse({'message': 'Education updated successfully', 'id': education.id}, status=200)

        elif request.method == 'DELETE':
            education = get_object_or_404(Education, id=data['id'])
            education.delete()
            return JsonResponse({'message': 'Education deleted successfully', 'id': data['id']}, status=200)

        return HttpResponse(status=405)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Education.DoesNotExist:
        return JsonResponse({'error': 'Education record not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)




# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Resume, StudentUser

class ResumeView(APIView):
    # Remove the permission requirement if you don't want authentication
    # permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        print(student_id, "in resume get")
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)
            return Response({
                'user_profile': user.id,
                'file': resume.file.url if resume.file else None
            }, status=status.HTTP_200_OK)
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, student_id):
        print(student_id, "in resume post")
        try:
            # Ensure `user` is an instance of `StudentUser`
            # print("last")
            user = StudentUser.objects.get(id=student_id)
            print(f"User instance retrieved: {user}")

            # Check if resume already exists for the user
            if Resume.objects.filter(user_profile=user).exists():
                return Response({'error': 'Resume already exists. Please update it instead.'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrieve file from request
            print("hfghsg")
            pdf_file = request.FILES.get('file')  
            if not pdf_file:
                return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)
            print("hffdgfghghsg")
            # Create new Resume instance
            resume = Resume.objects.create(user_profile=user, file=pdf_file)
            print("fdgfghghsg")
            return Response({
                'message': 'Resume created successfully',
                'user_profile': user.id,
                'file': resume.file.url if resume.file else None
            }, status=status.HTTP_201_CREATED)
        
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, student_id):
        print("in resume put")
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)

            pdf_file = request.FILES.get('file')
            if not pdf_file:
                return Response({'error': 'No file uploaded for update.'}, status=status.HTTP_400_BAD_REQUEST)

            resume.file = pdf_file
            resume.save()

            return Response({
                'message': 'Resume updated successfully',
                'user_profile': user.id,
                'file': resume.file.url if resume.file else None
            }, status=status.HTTP_200_OK)
        
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found. Please create it first.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, student_id):
        try:
            user = StudentUser.objects.get(id=student_id)
            resume = Resume.objects.get(user_profile=user)
            resume.delete()
            return Response({'message': 'Resume deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        
        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Resume.DoesNotExist:
            return Response({'error': 'Resume not found'}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import StudentUser, Skills
from .serializers import SkillsSerializer

class AddSkillView(APIView):
    def post(self, request, student_id):
        print(student_id)
        skill_name = request.data.get('skill_name')

        if not student_id or not skill_name:
            return Response({"error": "user_id and skill_name are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = StudentUser.objects.get(id=student_id)
        except StudentUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        skill = Skills.objects.create(user_profile=user, skill_name=skill_name)
        serializer = SkillsSerializer(skill)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, student_id):
        skill_name = request.data.get('skill_name')

        if not skill_name:
            return Response({"error": "skill_name is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = StudentUser.objects.get(id=student_id)
        except StudentUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Try to find an existing skill with the given name for this user
            skill = Skills.objects.get(user_profile=user, skill_name=skill_name)
            skill.skill_name = skill_name  # Update the name (if necessary, but may be redundant)
            skill.save()
            serializer = SkillsSerializer(skill)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Skills.DoesNotExist:
            # If the skill does not exist, create a new one
            skill = Skills.objects.create(user_profile=user, skill_name=skill_name)
            serializer = SkillsSerializer(skill)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, student_id):
        skill_id = request.data.get('id')

        if not skill_id:
            return JsonResponse({'error': 'Skill ID is required'}, status=400)

        try:
            # Ensure we are deleting a specific skill belonging to the given student
            skill = get_object_or_404(Skills, user_profile_id=student_id, id=skill_id)
            skill.delete()
            return JsonResponse({'message': 'Skill deleted successfully', 'id': skill_id}, status=200)
        except Skills.DoesNotExist:
            return JsonResponse({'error': 'Skill not found'}, status=404)
        

import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import ResumeSerializer
from .models import Resume, StudentUser
from rest_framework import status
import PyPDF2
from docx import Document
from groq import Groq
from company.models import Job  # Adjust the import if the Job model is elsewhere

class ResumeMatchView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, job_id, format=None):
        try:
            # Load Groq API key from environment variable
            groq_client = Groq(api_key = os.getenv("GROQ_API_KEY")
)
            print("GROQ_API_KEY:", os.getenv("GROQ_API_KEY"))

            # Ensure API key is loaded correctly
            if not os.getenv("GROQ_API_KEY"):
                return Response({'error': 'GROQ_API_KEY not found in environment variables'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            student_id = request.data.get("student_id")
            student = StudentUser.objects.get(id=student_id)
            job = Job.objects.get(id=job_id)

            # Check if there's an uploaded resume in the request
            file_obj = request.FILES.get('file')
            resume_text = ""

            if not file_obj:
                # If no resume uploaded, check if the student already has a resume in profile
                if student.resumes.exists():
                    file_obj = student.resumes.latest('uploaded_at').file
                else:
                    return Response({'error': 'No resume found. Please upload a resume.'}, status=status.HTTP_400_BAD_REQUEST)

            # Extract text from the resume file
            file_extension = os.path.splitext(file_obj.name)[1].lower()

            if file_extension == '.pdf':
                pdf_reader = PyPDF2.PdfReader(file_obj)
                for page in pdf_reader.pages:
                    resume_text += page.extract_text()
            elif file_extension == '.docx':
                file_obj.seek(0)
                document = Document(file_obj)
                resume_text = '\n'.join([para.text for para in document.paragraphs])
            else:
                return Response({'error': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if resume text was extracted
            if not resume_text.strip():
                return Response({'error': 'Could not extract text from the resume.'}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare the prompt for Groq
            prompt = (
                "You are a resume screening assistant.\n"
                "Given the following resume and job description, rate the match percentage between them "
                "on a scale from 0 to 100, where 0 means no match and 100 means perfect match. "
                "Provide only the numeric percentage in your response.\n\n"
                "Resume:\n"
                f"{resume_text}\n\n"
                "Job Description:\n"
                f"{job.job_description}\n\n"
                "Match Percentage:"
            )

            # Call the Groq API for chat completion
            try:
                response = groq_client.chat.completions.create(
                    messages=[{
                        "role": "user",
                        "content": prompt,
                    }],
                    model="llama3-8b-8192",  # Example model, replace if needed
                )
            except Exception as e:
                print(f"Error with Groq API: {e}")
                return Response({'error': 'Groq API failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Extract the match percentage from the response
            match_percentage_text = response.choices[0].message.content.strip()
            match_percentage = float(match_percentage_text)

            return Response({'match_percentage': match_percentage}, status=status.HTTP_200_OK)

        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return Response({'error': f'Internal Server Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        



class ResumeMatchDirectJDView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        try:
            # Load Groq API key from environment variable
            groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            print("GROQ_API_KEY:", os.getenv("GROQ_API_KEY"))

            # Ensure API key is loaded correctly
            if not os.getenv("GROQ_API_KEY"):
                return Response({'error': 'GROQ_API_KEY not found in environment variables'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            student_id = request.data.get("student_id")
            job_description = request.data.get("job_description")

            if not job_description:
                return Response({'error': 'Job description is required.'}, status=status.HTTP_400_BAD_REQUEST)

            student = StudentUser.objects.get(id=student_id)

            # Check if there's an uploaded resume in the request
            file_obj = request.FILES.get('file')
            resume_text = ""

            if not file_obj:
                # If no resume uploaded, check if the student already has a resume in profile
                if student.resumes.exists():
                    file_obj = student.resumes.latest('uploaded_at').file
                else:
                    return Response({'error': 'No resume found. Please upload a resume.'}, status=status.HTTP_400_BAD_REQUEST)

            # Extract text from the resume file
            file_extension = os.path.splitext(file_obj.name)[1].lower()

            if file_extension == '.pdf':
                pdf_reader = PyPDF2.PdfReader(file_obj)
                for page in pdf_reader.pages:
                    resume_text += page.extract_text()
            elif file_extension == '.docx':
                file_obj.seek(0)
                document = Document(file_obj)
                resume_text = '\n'.join([para.text for para in document.paragraphs])
            else:
                return Response({'error': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)

            # Check if resume text was extracted
            if not resume_text.strip():
                return Response({'error': 'Could not extract text from the resume.'}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare the prompt for Groq
            prompt = (
                "You are a resume screening assistant.\n"
                "Given the following resume and job description, rate the match percentage between them "
                "on a scale from 0 to 100, where 0 means no match and 100 means perfect match. "
                "Provide only the numeric percentage in your response.\n\n"
                "Resume:\n"
                f"{resume_text}\n\n"
                "Job Description:\n"
                f"{job_description}\n\n"
                "Match Percentage:"
            )

            # Call the Groq API for chat completion
            try:
                response = groq_client.chat.completions.create(
                    messages=[{
                        "role": "user",
                        "content": prompt,
                    }],
                    model="llama3-8b-8192",  # Example model, replace if needed
                )
            except Exception as e:
                print(f"Error with Groq API: {e}")
                return Response({'error': 'Groq API failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Extract the match percentage from the response
            match_percentage_text = response.choices[0].message.content.strip()
            match_percentage = float(match_percentage_text)

            return Response({'match_percentage': match_percentage}, status=status.HTTP_200_OK)

        except StudentUser.DoesNotExist:
            return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error processing request: {str(e)}")
            return Response({'error': f'Internal Server Error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
