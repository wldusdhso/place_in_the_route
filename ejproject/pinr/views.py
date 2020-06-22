from django.shortcuts import render


def base(request):
    return render(request, 'base.html')

def find_place(request, sx, sy, ex, ey, route):
    sx = 126.9027279
    sy = 37.5349277
    ex = 126.9145430
    ey = 37.5499421
    route_id = 0

    return render(request, 'find_place.html', {
        'sx' : sx,
        'sy' : sy,
        'ex' : ex,
        'ey' : ey,
        'route_id' : route_id,
        })


