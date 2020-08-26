/*Examples: 
site:http://googlemaps.github.io/js-samples/
http://googlemaps.github.io/js-samples/planetary-maptypes/planetary-maptypes.html
*/

 var mapTypes = {};
var overlay;
    // set up the map types

    var maxZoomIndex = 9 
    mapTypes['moon'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          var bound = Math.pow(2, zoom);
          return "http://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/" +
                 + zoom + "/" + coord.x + "/" + (bound - coord.y - 1) + '.jpg';
        });
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: maxZoomIndex,
      minZoom: 0,
      radius: 1738000,
      name: 'Moon',
      credit: 'Image Credit: NASA/USGS'
    };

    var maxZoomIndex = 9 
    mapTypes['moon_terrain'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          var bound = Math.pow(2, zoom);
          return "https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/terrain/" +
                 + zoom + "/" + coord.x + "/" + (bound - coord.y - 1) + '.jpg';
        });
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: maxZoomIndex,
      minZoom: 0,
      radius: 1738000,
      name: 'Moon Terrain',
      credit: 'Image Credit: NASA/USGS'
    };



    /*var maxZoomIndex = 13 
    mapTypes['sky'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          return "http://mw1.google.com/mw-planetary/sky/skytiles_v1/" +
                 coord.x + "_" + coord.y + '_' + zoom + '.jpg'; 
        });  
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: maxZoomIndex,
      radius: 57.2957763671875,
      name: 'Sky',
      credit: 'Image Credit: SDSS, DSS Consortium, NASA/ESA/STScI'
    };*/
    /*
    var maxZoomIndex = 9
    mapTypes['mars_elevation'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/elevation/", coord, zoom);
        });
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: 8,
      radius: 3396200,
      name: 'Mars Elevation',
      credit: 'Image Credit: NASA/JPL/GSFC'
    };
    
    mapTypes['mars_visible'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/visible/", coord, zoom);
        });
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: maxZoomIndex,
      radius: 3396200,
      name: 'Mars Visible',
      credit: 'Image Credit: NASA/JPL/ASU/MSSS'
    };
 
    mapTypes['mars_infrared'] = {
      getTileUrl: function(coord, zoom) {
        return getHorizontallyRepeatingTileUrl(coord, zoom, function(coord, zoom) {
          return getMarsTileUrl("http://mw1.google.com/mw-planetary/mars/infrared/", coord, zoom);
        });
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: false,
      maxZoom: maxZoomIndex,
      radius: 3396200,
      name: 'Mars Infrared',
      credit: 'Image Credit: NASA/JPL/ASU'
    };
    */
    

    var startMaxZoomIndex = maxZoomIndex;
    // Normalizes the tile URL so that tiles repeat across the x axis (horizontally) like the
    // standard Google map tiles.
    function getHorizontallyRepeatingTileUrl(coord, zoom, urlfunc) {
      var y = coord.y;
      var x = coord.x;
 
      // tile range in one direction range is dependent on zoom level
      // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
      var tileRange = 1 << zoom;
 
      // don't repeat across y-axis (vertically)
      if (y < 0 || y >= tileRange) {
        //return null;
        y = (y % tileRange + tileRange) % tileRange;
      }
 
      // repeat across x-axis
      if (x < 0 || x >= tileRange) {
       // return null;
        x = (x % tileRange + tileRange) % tileRange;
      }
 
      return urlfunc({x:x,y:y}, zoom)
    }
 
    /*function getMarsTileUrl(baseUrl, coord, zoom) {
      var bound = Math.pow(2, zoom);
      var x = coord.x;
      var y = coord.y;
      var quads = ['t'];
 
      for (var z = 0; z < zoom; z++) {
        bound = bound / 2;
        if (y < bound) {
          if (x < bound) {
            quads.push('q');
          } else {
            quads.push('r');
            x -= bound;
          }
        } else {
          if (x < bound) {
            quads.push('t');
            y -= bound;
          } else {
            quads.push('s');
            x -= bound;
            y -= bound;
          }
        }
      }
 
      return baseUrl + quads.join('') + ".jpg";
    }*/
 
    var map;
    var mapTypeIds = [];
 
    // Setup a copyright/credit line, emulating the standard Google style
    var creditNode = document.createElement('div');
    creditNode.id = 'credit-control';
    creditNode.style.fontSize = '9px';
    creditNode.style.fontFamily = 'Arial, sans-serif';
    creditNode.style.margin = '0';
    creditNode.style.whitespace = 'nowrap';
    creditNode.index = 0;
 
    function setCredit(credit) {
      creditNode.innerHTML = credit + ' -';
    }
 
    function initialize() {
 
      // push all mapType keys in to a mapTypeId array to set in the mapTypeControlOptions
      for (var key in mapTypes) {
        mapTypeIds.push(key);
      }
 
      var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(17.4973,4.6472),
        mapTypeControlOptions: {
          mapTypeIds: mapTypeIds,
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER
        },
      };
      map = new google.maps.Map(document.getElementById("map3d"), mapOptions);
 
      // push the credit/copyright custom control
      map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(creditNode);
      
      var centerPanel = (document.getElementById('centerPanel'));
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerPanel);
      if ($(window).width() > 768) {
        var dropDowns = document.getElementById('dropDowns');
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(dropDowns);
      }


      // add the new map types to map.mapTypes
      for (key in mapTypes) {
        map.mapTypes.set(key, new google.maps.ImageMapType(mapTypes[key]));
      }
 
      // handle maptypeid_changed event to set the credit line
      google.maps.event.addListener(map, 'maptypeid_changed', function() {
        setCredit(mapTypes[map.getMapTypeId()].credit);
      });
 
      // start with the moon map type
      map.setMapTypeId('moon');

      setTimeout(function() {
        waitForDeepLink()
      }, 500);

      map.addListener('center_changed', function() {
        clearInterval(zoomAnimation);
       //var deepLinkTimeout;
        //clearTimeout(deepLinkTimeout)
        //deepLinkTimeout = setTimeout(function() { setDeepLink() }, 2000)
      });
    }

var marker;
var markerIndex=0;
function addMarker(location, map, markerTitle) {
  if(markerIndex){
    marker.setMap(null);
  }
  markerIndex = 1;
  marker = new google.maps.Marker({
    position: location,
    title: markerTitle
  });
  marker.setMap(map);
  var infowindow = new google.maps.InfoWindow({
    content: markerTitle
  });
  infowindow.open(map, marker);
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}


