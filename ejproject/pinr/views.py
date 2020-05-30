from django.shortcuts import render


def index1(request):
    return render(request, 'index1.html')

def index2(request):
    return render(request, 'index2.html')

def side1(request):
    return render(request, 'side1.html')

def side2(request):
    return render(request, 'side2.html')

