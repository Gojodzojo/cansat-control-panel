import { useEffect, useState } from "react"

//https://dev.to/yezyilomo/global-state-management-in-react-with-global-variables-and-hooks-state-management-doesn-t-have-to-be-so-hard-2n2c

export class GlobalState<T> {
    private reRenderFunctions: React.Dispatch<React.SetStateAction<{}>>[]

    constructor(private value: T){
        this.reRenderFunctions = []
    }

    getValue() {
        return this.value
    }

    setValue(newVal: T, replace?: true): void
    setValue(newVal: { [key in keyof T]?: T[key] }, replace?: false): void
    setValue(newVal: any, replace: boolean = false) {
        if(replace) {
            if(this.value !== newVal) {
                this.value = newVal
                this.reRenderFunctions.forEach(reRender => reRender({}))
            }
        }
        else {
            let hasAnythingChanged = false
            Object.keys(newVal).forEach((key) => {
                if(this.value[key as keyof T] !== newVal[key]) {
                    this.value[key as keyof T] = newVal[key]
                    hasAnythingChanged = true
                }
            })
            if(hasAnythingChanged) {
                this.reRenderFunctions.forEach(reRender => reRender({}))
            }
        }
    }

    subscribe(reRender: React.Dispatch<React.SetStateAction<{}>>) {
        if (this.reRenderFunctions.indexOf(reRender) > -1) {
            // Already subsribed
            return
        }
        this.reRenderFunctions.push(reRender)
        return () => {this.reRenderFunctions = this.reRenderFunctions.filter(r => r !== reRender)}        
    }     
}

export function useGlobalState<T>(gs: GlobalState<T>) {
    const [,reRender] = useState({}) 
    
    useEffect(() => {
        const unsub = gs.subscribe(reRender)
        if(unsub === undefined) {
            console.log("useGlobalState error")
            return
        }
        return () => unsub()
    }, [])

    const state = gs.getValue()
    const setValue = (param1: any, param2?: any) => gs.setValue(param1, param2)           
    
    const result: [typeof state, typeof gs.setValue] = [state, setValue]
    return result
}

//setValue(callback: (oldVal: T) => T): void
    /*setValue(param: any) {
        let newVal: T
        if(typeof params === "function") {
            newVal = param(this.getValue())
        }
        else {
            newVal = param
        }
        console.log(newVal)
        console.log(this.value)
        if(newVal !== this.value) {
            this.reRenderFunctions.forEach(reRender => reRender({}))
        }        
    }    */


/*setValue(newVal: T): void
    setValue(propertyName: keyof T, newVal: T[typeof propertyName]): void    
    

    setValue(param1: any, param2?: any) {
        if(typeof param1 === "string" && param2 !== undefined && this.value[param1 as keyof T] !== param2) {
            this.value[param1 as keyof T] = param2
            this.reRenderFunctions.forEach(reRender => reRender({}))
        }
        else if(this.value !== param1) {
            this.value = param1
            this.reRenderFunctions.forEach(reRender => reRender({}))
        }
    }    */  