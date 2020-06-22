from django.shortcuts import render


def base(request):
    return render(request, 'base.html')

def find_route(request):
    return render(request, 'find_route.html')

def find_place(request, sx, sy, ex,  ey, route):

    return render(request, 'find_place.html', {
        'sx' : sx,
        'sy' : sy,
        'ex' : ex,
        'ey' : ey,
        'route' : route
    })


