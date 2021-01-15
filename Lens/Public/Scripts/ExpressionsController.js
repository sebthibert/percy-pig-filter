// ExpressionsController.js
// Version: 2.0.0
// Description: Maps blendshape expressions to 3D blendshapes

// @input Component.RenderMeshVisual rightEyebrowComponent   {"label":"Right Eyebrow"}
// @input Component.RenderMeshVisual leftEyebrowComponent    {"label":"Left Eyebrow"}
// @input Component.RenderMeshVisual leftEyeComponent        {"label":"Left Eye"}
// @input Component.RenderMeshVisual rightEyeComponent       {"label":"Right Eye"}
// @input Component.RenderMeshVisual jawComponent            {"label":"Jaw"}
// @input Component.RenderMeshVisual faceMesh

var expressionNames = new Array(),
    expressionWeights = new Array(),
    components = new Array();

if (script.faceMesh) {
    if (!script.faceMesh.enabled || !script.faceMesh.getSceneObject().enabled) {
        print("ExpressionController, ERROR: Please enable '" + script.faceMesh.getSceneObject().name + "' Scene Object");
    }
    if (script.faceMesh.mesh == null) {
        print("ExpressionController, ERROR: Please set Face Mesh asset for '" + script.faceMesh.getSceneObject().name + "' Scene Object");
    }
} else {
    print("ExpressionController, ERROR: Please define Face Mesh Scene Object in Advanced section");
}

if (!script.rightEyebrowComponent) {
    print("ExpressionController, ERROR: Please define right eyebrow component");
}

if (!script.leftEyebrowComponent) {
    print("ExpressionController, ERROR: Please define left eyebrow component");
}

if (!script.leftEyeComponent) {
    print("ExpressionController, ERROR: Please define left eye component");
}

if (!script.rightEyeComponent) {
    print("ExpressionController, ERROR: Please define right eye component");
}

if (!script.jawComponent) {
    print("ExpressionController, ERROR: Please define jaw component");
}

if (!!script.leftEyebrowComponent) { components.push(script.leftEyebrowComponent); }
if (!!script.rightEyebrowComponent) { components.push(script.rightEyebrowComponent); }
if (!!script.leftEyeComponent) { components.push(script.leftEyeComponent); }
if (!!script.rightEyeComponent) { components.push(script.rightEyeComponent); }
if (!!script.jawComponent) { components.push(script.jawComponent); }

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

function setBlendShapes() {
    for (var c = 0; c < components.length; c++) {
        var component = components[c];
        for (var i = 0; i < expressionNames.length; i++) {
            var name = expressionNames[i];
            if (!component.hasBlendShapeWeight(name)) {
                continue;
            }
            component.setBlendShapeWeight(name, expressionWeights[i]);
        }
    }
}

function onUpdate() {
    if (script.faceMesh && script.faceMesh.mesh) {
        expressionNames = script.faceMesh.mesh.control.getExpressionNames();
        expressionWeights = script.faceMesh.mesh.control.getExpressionWeights();
    }
    if (expressionNames.length < 1) {
        return;
    }
    setBlendShapes();
}
