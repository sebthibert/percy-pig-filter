// DragScreenTransform.js
// Version: 0.0.1
// Description: Allows you to drag a Screen Transform

// @input Component.ScreenTransform screenTransform
// @input bool dragX = true
// @input bool dragY = true
// @input vec2 limitsHorizontal = {-2, 2}
// @input vec2 limitsVertical = {-2, 2} 
// @input bool allowOnStart = false;

script.api.limitsHorizontal = script.limitsHorizontal;
script.api.limitsVertical = script.limitsVertical;
script.api.limitScreenTransform = script.limitScreenTransform;
script.api.setDraggable = setDraggable;

var draggable = true;

var isDragging;
var offset;
var startPos;

global.touchSystem.touchBlocking = true;
var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(onTouchStart);
var touchEndEvent = script.createEvent("TouchEndEvent");
touchEndEvent.bind(onTouchEnd);
var touchMoveEvent = script.createEvent("TouchMoveEvent");
touchMoveEvent.bind(onTouchMove);

setDraggable(script.allowOnStart);

function initialize() {
    global.touchSystem.touchBlocking = true;
    global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", true);
    
    isDragging = false;
    offset = vec2.zero();
    startPos = script.screenTransform.anchors.getCenter();
    startPos.x = clamp(script.api.limitsHorizontal.x, script.api.limitsHorizontal.y, startPos.x);
    startPos.y = clamp(script.api.limitsVertical.x, script.api.limitsVertical.y, startPos.y);
    script.screenTransform.anchors.setCenter(startPos);
}

function onTouchStart(eventData) {
    var touchPos = eventData.getTouchPosition();
    if (draggable && script.screenTransform.containsScreenPoint(touchPos)) {
        var localPosition = script.screenTransform.screenPointToParentPoint(touchPos);
        offset = localPosition.sub(script.screenTransform.anchors.getCenter());
        isDragging = true;
    }
}

function onTouchMove(eventData) {
    if (isDragging) {
        var touchPos = eventData.getTouchPosition();
        var localPosition = script.screenTransform.screenPointToParentPoint(touchPos).sub(offset);
        if (!script.dragX) {
            localPosition.x = startPos.x;
        } else {
            localPosition.x = clamp(script.api.limitsHorizontal.x, script.api.limitsHorizontal.y, localPosition.x);
        }
        if (!script.dragY) {
            localPosition.y = startPos.y;
        } else {
            localPosition.y = clamp(script.api.limitsVertical.x, script.api.limitsVertical.y, localPosition.y);
        }
        script.screenTransform.anchors.setCenter(localPosition);
    }
}

function onTouchEnd() {
    isDragging = false;
}

function clamp(min, max, v) {
    return Math.min(Math.max(v, min), max);
}

function setDraggable(v) {
    if (v) {
        initialize();
    }    
    
    draggable = v;

    touchEndEvent.enabled = v;
    touchStartEvent.enabled = v;
    touchMoveEvent.enabled = v;
}
