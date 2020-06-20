var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

if (navigator.geolocation) {

    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        map.setCenter(locPosition);
    });
}


// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);

// 마커를 담을 배열입니다
var markers = [];

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

var start_or_end = '';
var sx, sy, ex, ey ;

// 키워드 검색을 요청하는 함수입니다
function searchPlaces_start() {
    console.log("방가");
    var keyword = document.getElementById('keyword_start').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    start_or_end = 'start';

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB, { size: 6 });
}

function searchPlaces_end() {
    console.log("메롱");
    var keyword = document.getElementById('keyword_end').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    start_or_end = 'end';

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCB, { size: 6 });
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {

    var listEl = document.getElementById('placeList'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = '';

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    for (var i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function (marker, place) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                displayInfowindow(marker, place.place_name);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });

            itemEl.onmouseover = function () {
                var position = new kakao.maps.LatLng(place.y, place.x);
                displayInfowindow(marker, place.place_name);
                map.panTo(position);
            };

            itemEl.onmouseout = function () {
                infowindow.close();
            };

            itemEl.onclick = function () {
                if (start_or_end == 'start') {
                    sx = place.x;
                    sy = place.y; 
                    console.log(sx);
                } else if (start_or_end == 'end') {
                    ex = place.x;
                    ey = place.y;
                    console.log(ex);
                }
            };
        })(marker, places[i]);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

    var el = document.createElement('a'),
        itemStr = '<div class="d-flex w-100 justify-content-between">' +
            '   <h5 class="mb-1">' + places.place_name + '</h5>' + '</div>';

    if (places.road_address_name) {
        itemStr += '    <p class="mb-1">' + places.road_address_name + '</p>';
    } else {
        itemStr += '    <p class="mb-1">' + places.address_name + '</p>';
    }

    itemStr += '  <small class="text-muted">' + places.phone + '</small>';

    el.innerHTML = itemStr;
    el.className = 'list-group-item list-group-item-action';

    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

function searchPubTransPathAJAX() {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/searchPubTransPath?SX=" + sx + "&SY=" + sy + "&EX=" + ex + "&EY=" + ey + "&apiKey=Z1tI1PHDPV7ueYpK4TUU2A";
    var overlays = manager.getOverlays();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText); // <- xhr.responseText 로 결과를 가져올 수 있음
            //지도 위 폴리라인과 마커 지우기
            removeMarker();
            
            overlays['polyline'].forEach(function(polyline) {
                manager.remove(polyline);
                console.log("폴리라인 삭제");
            });
            //노선그래픽 데이터 호출
            callMapObjApiAJAX((JSON.parse(xhr.responseText))["result"]["path"][0].info.mapObj);
        }
    }
}

function callMapObjApiAJAX(mabObj) {
    var xhr = new XMLHttpRequest();
    //ODsay apiKey 입력
    var url = "https://api.odsay.com/v1/api/loadLane?mapObject=0:0@" + mabObj + "&apiKey=Z1tI1PHDPV7ueYpK4TUU2A";
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var resultJsonData = JSON.parse(xhr.responseText);
            drawKakaoMarker(sx, sy);					// 출발지 마커 표시
            drawKakaoMarker(ex, ey);					// 도착지 마커 표시
            drawKakaoPolyLine(resultJsonData);		// 노선그래픽데이터 지도위 표시
            // boundary 데이터가 있을경우, 해당 boundary로 지도이동
            if (resultJsonData.result.boundary) {
                var boundary = new kakao.maps.LatLngBounds(
                    new kakao.maps.LatLng(resultJsonData.result.boundary.top, resultJsonData.result.boundary.left),
                    new kakao.maps.LatLng(resultJsonData.result.boundary.bottom, resultJsonData.result.boundary.right)
                );
                map.panTo(boundary);
            }
        }
    }
}

// 지도위 마커 표시해주는 함수
function drawKakaoMarker(x, y) {
    var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(y, x),
        map: map
    });
}

// 노선그래픽 데이터를 이용하여 지도위 폴리라인 그려주는 함수
function drawKakaoPolyLine(data) {
    var lineArray;

    for (var i = 0; i < data.result.lane.length; i++) {
        for (var j = 0; j < data.result.lane[i].section.length; j++) {
            lineArray = null;
            lineArray = new Array();
            for (var k = 0; k < data.result.lane[i].section[j].graphPos.length; k++) {
                lineArray.push(new kakao.maps.LatLng(data.result.lane[i].section[j].graphPos[k].y, data.result.lane[i].section[j].graphPos[k].x));
            }

            //지하철결과의 경우 노선에 따른 라인색상 지정하는 부분 (1,2호선의 경우만 예로 들음)
            if (data.result.lane[i].type == 1) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#003499'
                });
            } else if (data.result.lane[i].type == 2) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#37b42d'
                });
            } else if (data.result.lane[i].type == 3) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#E9945A'
                });
            } else if (data.result.lane[i].type == 4) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#3165A8'
                });
            } else if (data.result.lane[i].type == 5) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#703E8C'
                });
            } else if (data.result.lane[i].type == 6) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#904D23'
                });
            } else if (data.result.lane[i].type == 7) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#5B692E'
                });
            } else if (data.result.lane[i].type == 8) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#C82363'
                });
            } else if (data.result.lane[i].type == 9) {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3,
                    strokeColor: '#B39627'
                });
            } else {
                var polyline = new kakao.maps.Polyline({
                    map: map,
                    path: lineArray,
                    strokeWeight: 3
                });
            }
        }
    }
}