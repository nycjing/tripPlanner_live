

function selectRightItem(type, id) {
    let location;
    let name;

    if (type === 'restaurant') {
        name = restaurants[id - 1].name;
        itinerary.restaurant = name;
        location = restaurants[id - 1].place.location;
    };
    if (type === 'hotel') {
        name = hotels[id - 1].name;
        itinerary.hotel = name;
        location = hotels[id - 1].place.location;
    };
    if (type === 'activity') {
        name = activities[id - 1].name;
        itinerary.activity = name;
        location = activities[id - 1].place.location;
    };

    loadRightItem(type, name);
    // Add marker as long as marker is not already inside MarkerArr
    if (findMarkerInMarkersArray(type, name) === -1) {
        markersArr.push({type, location, name, id}); //check uniqueness on multiple button presses and itinerary day
    }
};

function deleteItem (type, name) {
    // select day
    // if inside itineraryArr select the type
    let indexToDelete = findMarkerInMarkersArray(type, name);
    if (indexToDelete !== -1) markersArr.splice(indexToDelete, 1);
    deleteAllMarkers();
    drawMarkers();
};

function loadRightItem(type, name) {
    const selector = "#" + type;
    $(selector).text(name);
};

function drawMarkers () {
    markersArr.forEach(function(mark) {
        console.log("drawing marker");
        drawMarker(mark.type, mark.location);
    });
}

function findMarkerInMarkersArray (type, name) {
    var result = -1;
    markersArr.forEach( function(marker, idx) {
        if (marker.type === type && marker.name === name)   result = idx;
    });

    return result;
}

const $optionPanel = $('#options-panel');
const $itineraryPanel = $('#itinerary');
const $dayPanel = $('#day');
const $dayTitlePanel = $('#day-title');

$optionPanel.on('click', 'button', function (event) {
    const $selectItem = $(this).siblings('select');
    const $id = $selectItem.val();
    const $type = $selectItem.attr("data-type");
    console.log('id', $id, 'type', $type);
    selectRightItem($type, $id);

    //272
    drawMarkers();
    console.log("After click MarkersArr grows: ", markersArr);
});

$itineraryPanel.on('click', '.remove', function (event) {
    const $selectItem = $(this).siblings('span');
    console.log($selectItem, 'name', $selectItem[0].innerText, 'type', $selectItem[0].id);
    const $type = $selectItem[0].id;
    const $name = $selectItem[0].innerText;
    deleteItem ($type, $name);
});

$dayPanel.on('click', '.day-btn', function (event) {
    const $selectItem = $(this);
    const $oldcurrentday = $(this).siblings(".current-day");
    itineraryArr[+$oldcurrentday[0].innerText-1] = ({itin: itinerary, markers:markersArr}) ;
    $oldcurrentday.removeClass("current-day");
    const $dayNum = $selectItem[0].innerText;
    if ($dayNum === '+'){

        $newNum= +($selectItem.prev('.btn')[0].innerText) + 1;
        $selectItem.addClass("current-day");
        $selectItem.text($newNum)
        $dayTitlePanel.children('span').text("Day " + $newNum);
        $selectItem.parent().append($('<button></button>').text('+').addClass("btn").addClass("btn-circle").addClass("day-btn"));
        $dayNum = $newNum.toString();
    }
    $selectItem.addClass("current-day");
    $dayTitlePanel.children('span').text("Day " + $dayNum);
    if (itineraryArr[+$dayNum-1]) {

        itinerary = itineraryArr[+$dayNum-1].itin;
        markersArr = itineraryArr[+$dayNum-1].markers;

    }
    else {
        markersArr = [];
        itinerary = {restaurant: '', hotel: '', activity: ''};
    }
    types = Object.keys(itinerary);

    types.forEach((type)=>{
        loadRightItem(type, itinerary[type]);
    });

    deleteAllMarkers();
    drawMarkers();

});
