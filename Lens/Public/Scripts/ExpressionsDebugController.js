// ExpressionsDebugController.js
// Version: 1.0.0
// Description: Shows blendshape expressions in UI

//@input bool customizeExpressions = false
//@ui {"widget" : "group_start", "label" :"Custom Settings", "showIf":"customizeExpressions"}
//@input bool BrowsDownLeft = false
//@input bool BrowsDownRight = false
//@input bool BrowsUpCenter = false
//@input bool BrowsUpLeft = false
//@input bool BrowsUpRight = false
//@input bool CheekSquintLeft = false
//@input bool CheekSquintRight = false
//@input bool EyeBlinkLeft = false
//@input bool EyeBlinkRight = false
//@input bool EyeDownLeft = false
//@input bool EyeDownRight = false
//@input bool EyeInLeft = false
//@input bool EyeInRight = false
//@input bool EyeOpenLeft = false
//@input bool EyeOpenRight = false
//@input bool EyeOutLeft = false
//@input bool EyeOutRight = false
//@input bool EyeSquintLeft = false
//@input bool EyeSquintRight = false
//@input bool EyeUpLeft = false
//@input bool EyeUpRight = false
//@input bool JawForward = false
//@input bool JawLeft = false
//@input bool JawOpen = false
//@input bool JawRight = false
//@input bool LipsFunnel = false
//@input bool LipsPucker = false
//@input bool LowerLipClose = false
//@input bool LowerLipDownLeft = false
//@input bool LowerLipDownRight = false
//@input bool LowerLipRaise = false
//@input bool MouthClose = false
//@input bool MouthDimpleLeft = false
//@input bool MouthDimpleRight = false
//@input bool MouthFrownLeft = false
//@input bool MouthFrownRight = false
//@input bool MouthLeft = false
//@input bool MouthRight = false
//@input bool MouthSmileLeft = false
//@input bool MouthSmileRight = false
//@input bool MouthStretchLeft = false
//@input bool MouthStretchRight = false
//@input bool MouthUpLeft = false
//@input bool MouthUpRight = false
//@input bool Puff = false
//@input bool SneerLeft = false
//@input bool SneerRight = false
//@input bool UpperLipClose = false
//@input bool UpperLipRaise = false
//@input bool UpperLipUpLeft = false
//@input bool UpperLipUpRight = false
//@ui {"widget" : "group_end", "showIf":"customizeExpressions"}

//@input bool advanced = true
//@input vec4 browsColor = {0.95, 0.71, 0.0, 1.0} {"widget":"color", "showIf" : "advanced"}
//@input vec4 eyeColor = {0.13, 0.76, 0.88, 1.0} {"widget":"color", "showIf" : "advanced"}
//@input vec4 defaultColor = {0.69, 0.55, 1.0, 1.0} {"widget":"color", "showIf" : "advanced"}
//@input vec4 lipsColor =  {0.0, 0.82, 0.67, 1.0} {"widget":"color", "showIf" : "advanced"}
//@input vec4 mouthColor = {1.0, 0.41, 0.37, 1.0} {"widget":"color", "showIf" : "advanced"}
//@input Component.RenderMeshVisual faceMesh {"showIf" : "advanced"}
//@input Component.Head head {"showIf" : "advanced"}
//@input SceneObject uiExpressionsList {"showIf" : "advanced"}
//@input SceneObject uiSampleEntry {"showIf" : "advanced"}
//@input Component.Text uiExpressionsHint {"showIf" : "advanced"}
//@input Component.ScriptComponent layoutScript {"showIf" : "advanced"}
//@input Component.ScriptComponent dragScript {"showIf" : "advanced"}
//@input Component.ScreenTransform viewWindow {"showIf" : "advanced"}

var expressionNames = new Array();
var expressionWeights = new Array();
var screenObject = new Array();
var uiInitialized = false;

global.touchSystem.touchBlocking = true;
global.touchSystem.enableTouchBlockingException("TouchTypeTap", true);
global.touchSystem.enableTouchBlockingException("TouchTypeDoubleTap", true);
global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", true);

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(onUpdate);

var tapEvent = script.createEvent("TapEvent");
tapEvent.bind(onTapEvent);

var faceFoundEvent = script.createEvent("FaceFoundEvent");
faceFoundEvent.bind(onFaceFound);

var faceLostEvent = script.createEvent("FaceLostEvent");
faceLostEvent.bind(onFaceLost);

if (script.uiExpressionsHint) {
    script.uiExpressionsHint.enabled = false;
} else {
    print("ExpressionsDebugController, Warning: Please define Hint in Advanced section");
}

if (script.uiExpressionsList == null) {
    print("ExpressionsDebugController, ERROR: Please define Expressions List Object in Advanced section");
}
    
if (script.uiSampleEntry == null) {
    print("ExpressionsDebugController, ERROR: Please define Expression Sample Entry Object in Advanced section");
}

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
    
if (script.head) {
    faceFoundEvent.faceIndex = script.head.faceIndex;
    faceLostEvent.faceIndex = script.head.faceIndex;
} else {
    print("ExpressionsDebugController, ERROR: Please define Head Component in Advanced section");
}

function onUpdate() {
    if (script.faceMesh && script.faceMesh.mesh) {
        expressionNames = script.faceMesh.mesh.control.getExpressionNames();
        expressionWeights = script.faceMesh.mesh.control.getExpressionWeights();
    }

    if (expressionNames.length < 1) {
        return;
    }
    
    UIInit();
    
    for (var i = 0; i < expressionWeights.length; i++) {
        var expression = expressionNames[i];
       
        if (expression && script[expression] && screenObject[i]) {
            if (screenObject[i].weight) {
                screenObject[i].weight.text = expressionWeights[i].toFixed(2).toString();
            }
            
            if (screenObject[i].slider) {
                screenObject[i].slider.mainMaterial.mainPass.percentage = expressionWeights[i];
            } 
        }
    }
}

function onTapEvent() {
    if (script.uiExpressionsList) {
        script.uiExpressionsList.enabled = !script.uiExpressionsList.enabled;
    }
}

function onFaceFound() { 
    if (script.uiExpressionsList) {
        script.uiExpressionsList.enabled = true;
    }
}

function onFaceLost() {
    if (script.uiExpressionsList) {
        script.uiExpressionsList.enabled = false;
    }
}

function UIInit() {
    if (!uiInitialized) {
        for (var i = 0; i < expressionNames.length; i++) {
            var expression = expressionNames[i];        
            
            if (script[expression] == null) {
                print("ExpressionsDebugController, ERROR: Wrong expression name " + expression);
                continue;
            }
            
            if ((typeof script[expression]) !== "boolean") {
                print("ExpressionsDebugController, ERROR: Wrong type for script[" + expression + "]: " + typeof script[expression]);
                continue;
            }
            
            var curObj = script.uiSampleEntry;
            
            if (script[expression]) {
                curObj = script.uiExpressionsList.copyWholeHierarchy(script.uiSampleEntry);
            }
            
            var entry = {
                sceneObject : curObj,
                name : getComponentSafe(findChildByName(curObj, "Expression"), "Component.Text"),
                slider : getComponentSafe(findChildByName(curObj, "Slider"), "Component.Image"),
                weight : getComponentSafe(findChildByName(curObj, "Weight"), "Component.Text")
            };
            
            var color = script.defaultColor;
                
            if (expression.includes("Eye")) {
                color = script.eyeColor;
            }
            if (expression.includes("Brow")) {
                color = script.browsColor;
            }                
            if (expression.includes("Mouth")) {
                color = script.mouthColor;
            }               
            if (expression.includes("Lip")) {
                color = script.lipsColor;
            }


            if (entry.slider && entry.slider.mainMaterial) {
                entry.slider.mainMaterial = entry.slider.mainMaterial.clone();
                entry.slider.mainMaterial.mainPass.customColor = color;
            }
        
            if (entry.name) {
                entry.name.text = expression;
            }
            
            if (entry.sceneObject) {
                entry.sceneObject.enabled = script[expression];
            }
            
            if (entry.weight) {
                entry.weight.dropshadowSettings.fill.color = color;
            }

            screenObject.push(entry);

        }
        
        if (script.uiExpressionsHint) {
            script.uiExpressionsHint.enabled = true;
        }
        
        initializeLayout();
        
        uiInitialized = true;
    }
}


function initializeLayout() {
    if (script.layoutScript) {
        script.layoutScript.api.initialize();
        script.layoutScript.api.updateLayout();
    } else {
        print("ExpressionsDebugController, ERROR: Please define Layout Script in Advanced section");
    }
    
    if (script.dragScript) {
        setDragLimits();
    } else {
        print("ExpressionsDebugController, ERROR: Please define Drag Script in Advanced section");
    }
}

function setDragLimits() {
    //calculate limits of drag script
    var parent = script.layoutScript.getSceneObject();
    var parentScreenTransform = parent.getComponent("Component.ScreenTransform"); 

    var topRightScreen = parentScreenTransform.localPointToScreenPoint(new vec2(1, 1));
    var botLeftScreen = parentScreenTransform.localPointToScreenPoint(new vec2(-1, -1));

    var top = script.viewWindow.screenPointToLocalPoint(topRightScreen).y - 1.0; // bottom layout point - half window size
    var bottom = script.viewWindow.screenPointToLocalPoint(botLeftScreen).y + 1.0; // top layout point - half window size

    //putting center of layout to the bottom position
    var center = parentScreenTransform.anchors.getCenter();
    center.y = bottom;
    parentScreenTransform.anchors.setCenter(center);

    // setting limits of a drag script and allowing drag
    //to cover both cases - if window is smaler and if window is bigger
    top = Math.max(top, -top);
    bottom = Math.min(bottom, -bottom);

    script.dragScript.api.limitsVertical = new vec2(bottom, top);
    script.dragScript.api.setDraggable(true);
}

function getComponentSafe(sceneObject, componentType) {
    var component = null;
    if (sceneObject) {
        component = sceneObject.getComponent(componentType);
    }
    return component;
}

function findChildByName(sceneObject, name) {
    var child = null;
    
    for (var i = 0; i < sceneObject.getChildrenCount(); i++) {
        var curChild = sceneObject.getChild(i);
        if (curChild.name.includes(name)) {
            child = curChild;
        }
    }
    
    return child;
}