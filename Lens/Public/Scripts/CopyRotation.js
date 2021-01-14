// CopyRotation.js
// Version: 0.0.1
// Description: Copies rotation from one object to another

// @input SceneObject sourceObject
// @input SceneObject targetObject

var targetTransform;
var sourceTransform;

if (script.targetObject) {
    targetTransform = script.targetObject.getTransform();
} else {
    targetTransform = script.getSceneObject().getTransform();
}

if (script.sourceObject) {
    sourceTransform = script.sourceObject.getTransform();
} else {
    print ("[CopyRotation] Source object is not set");
}

function onUpdate() {
    if (sourceTransform) {
        targetTransform.setWorldRotation(script.sourceObject.getTransform().getWorldRotation());
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);
