from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Post, Review, Report

def home(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, 'home.html', {'posts': posts})


def register(request):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        user = form.save()
        login(request, user)
        return redirect('home')
    return render(request, 'register.html', {'form': form})


@login_required
def create_post(request):
    if request.method == 'POST':
        post = Post.objects.create(
            author=request.user,
            title=request.POST['title'],
            content=request.POST['content']
        )

        files = request.FILES.getlist('images')

        for f in files:
            PostImage.objects.create(post=post, image=f)

        return redirect('home')

    return render(request, 'create_post.html')

def profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    reviews = user.reviews.all()

    if request.method == 'POST':
        if 'review' in request.POST:
            Review.objects.create(
                user=user,
                reviewer=request.user,
                comment=request.POST['comment'],
                rating=request.POST['rating']
            )
        elif 'report' in request.POST:
            Report.objects.create(
                reported_user=user,
                reporter=request.user,
                reason=request.POST['reason']
            )
        return redirect('profile', user_id=user.id)

    return render(request, 'profile.html', {'profile_user': user, 'reviews': reviews})


@login_required
def dashboard(request):
    if not request.user.is_staff:
        return redirect('home')

    users = User.objects.all()
    reports = Report.objects.all()
    posts = Post.objects.all()

    return render(request, 'dashboard.html', {
        'users': users,
        'reports': reports,
        'posts': posts
    })

@login_required
def update_avatar(request):
    if request.method == 'POST':
        profile = request.user.profile
        profile.avatar = request.FILES.get('avatar')
        profile.save()
        return redirect('profile', user_id=request.user.id)