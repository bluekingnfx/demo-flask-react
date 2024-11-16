import { useReducer, useState } from "react"


type State = {
    petalWidth: number;
    sepalWidth: number;
    petalHeight: number;
    sepalHeight: number;
}


const reducer = (state:State,action:{
    type: 'SET_PETAL_WIDTH' | 'SET_PETAL_HEIGHT' | 'SET_SEPAL_WIDTH' | 'SET_SEPAL_HEIGHT',
    payload: number
}):State => {
    switch(action.type){
        case 'SET_PETAL_HEIGHT':
            return {
                ...state,
                petalHeight: action.payload
            }
        case 'SET_PETAL_WIDTH':
            return {
                ...state,
                petalWidth: action.payload
            }
        case 'SET_SEPAL_HEIGHT':
            return {
                ...state,
                sepalHeight: action.payload
                }
        case "SET_SEPAL_WIDTH":
            return {
                ...state,
                sepalWidth: action.payload
            }
        default:
            return {
                petalHeight:0,
                petalWidth:0,
                sepalHeight:0,
                sepalWidth: 0
            }
    }
}


const processData = async(
    e:React.FormEvent<HTMLFormElement>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setResults: React.Dispatch<React.SetStateAction<string | undefined>>,
    state: State
) => {
    e.preventDefault()
    e.stopPropagation()
    try{
        setLoading(true)
        setResults(undefined)
        const data = new FormData()
        data.append("features", JSON.stringify(state))
        const response = await fetch("http://localhost:5000/predict", {
            method:"POST",
            body:data
        })
        console.log(response)
        const response_json = await response.json() as {
            result:string,
            status: number
        }

        console.log(response_json)

        if(response_json.status === 200){
            setResults(response_json.result)
        }else{
            throw Error("Not able to find.")
        }
        
        setLoading(false)

    }catch(e){
        console.log(e)
    }
}


const App = () => {
    const [state,dispatch] = useReducer(reducer, {
        petalWidth: 0,
        sepalWidth: 0,
        petalHeight: 0,
        sepalHeight: 0
    })
    const [loading,setLoading] = useState<boolean>(false)
    
    const [results,setResults] = useState<string | undefined>(undefined)

    return (
        <>
            <form onSubmit={(e) => {
                processData(e,setLoading,setResults,state)
            }} >
                <label htmlFor="Sepal width" >Sepal width: </label>
                <input id="Sepal width" onChange={(e) => dispatch({type:"SET_SEPAL_WIDTH",payload:Number(e.target.value)})} value={state.sepalWidth}></input>
                <br/>
                <label htmlFor="Sepal height" >Sepal height: </label>
                <input id="Sepal height" onChange={(e) => dispatch({type:"SET_SEPAL_HEIGHT",payload:Number(e.target.value)})} value={state.sepalHeight}></input>
                <br/>
                <label htmlFor="Petal height">Petal height: </label>
                <input id="Petal height" onChange={(e) => dispatch({type:"SET_PETAL_HEIGHT",payload:Number(e.target.value)})} value={state.petalHeight}></input>
                <br/>
                <label htmlFor="Petal width" >Petal width: </label>
                <input id="Petal width" onChange={(e) => dispatch({type:"SET_PETAL_WIDTH",payload:Number(e.target.value)})} value={state.petalWidth}></input>
                <br/>
                <button type="submit">Submit</button>
            </form>
            {
                loading === false && results && <div>
                    {
                        results
                    }
                </div>
            }
            {
                loading === true && <div>loading...</div>
            }
        </>

    )
}

export default App