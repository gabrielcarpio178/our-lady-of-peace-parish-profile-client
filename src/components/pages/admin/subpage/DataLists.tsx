import React from 'react'

interface Idatalist {
    names: string[],
    selectorId: string;
}

const DataLists:React.FC<Idatalist> = ({names, selectorId}) => {
    return (
        <>
            <datalist id={selectorId}>
                {names.map((name: string)=>{
                    return (<option key={name} value={name}>{name}</option>)
                })}
            </datalist>
        </>
    )
}

export default DataLists