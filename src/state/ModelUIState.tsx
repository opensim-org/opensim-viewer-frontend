import { makeObservable, observable, action } from 'mobx'
import SceneTreeModel from '../helpers/SceneTreeModel'
import { AnimationClip } from 'three/src/animation/AnimationClip'

export class ModelUIState {
    currentModelPath: string
    rotating: boolean
    zooming: boolean
    zoom_inOut: number
    takeSnapshot: boolean
    showGlobalFrame: boolean
    sceneTree: SceneTreeModel | null
    animating: boolean
    animationSpeed: number
    animations: AnimationClip[]
    selected: string

    constructor(
        currentModelPathState: string,
        rotatingState: boolean,
    ) {
        this.currentModelPath = currentModelPathState
        this.rotating = rotatingState
        this.zooming = false
        this.zoom_inOut = 0.0
        this.takeSnapshot = false
        this.showGlobalFrame = false
        this.sceneTree = null
        this.animating = false
        this.animationSpeed = 1.0
        this.animations = []
        this.selected = ""
        makeObservable(this, {
            rotating: observable,
            currentModelPath: observable,
            zooming: observable,
            showGlobalFrame: observable,
            setRotating: action,
            setCurrentModelPath: action,
            setZooming: action,
            setShowGlobalFrame: action,
            animationSpeed: observable,
            setAnimationSpeed: action,
            selected: observable,
        })
        console.log("Created ModelUIState instance ", currentModelPathState)
    }

    setCurrentModelPath(newState: string) {
        this.currentModelPath = newState
    }
    setRotating(newState: boolean) {
        this.rotating = newState
    }
    setZooming(newState: boolean) {
        this.zooming = newState
    }
    setZoomFactor(inOut: number) {
        this.zoom_inOut = inOut
    }
    setTakeSnapshot() {
        this.takeSnapshot = true
    }
    setAnimating(newState: boolean){
        this.animating = newState
    }
    setShowGlobalFrame(newState: boolean) {
        this.showGlobalFrame = newState 
    }
    setSceneTree(newTree: SceneTreeModel) {
        this.sceneTree = newTree
    }
    setAnimationList(animations: AnimationClip[]) {
        this.animations=animations
    }
    setAnimationSpeed(newSpeed: number) {
        this.animationSpeed = newSpeed
    }
    setSelected(uuid: string) {
        this.selected = uuid
    }
}

export let modelUIState = new ModelUIState('', false);