from django.shortcuts import render


def index1(request):
    return render(request, 'index1.html')


