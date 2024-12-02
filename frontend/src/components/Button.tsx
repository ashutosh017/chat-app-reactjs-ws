export const Button = ({func,children}:{func:()=>void,children:React.ReactNode})=>{
    return <button className="bg-blue-700 p-2 rounded-md cursor-pointer hover:bg-blue-600 text-white" onClick={func}> {children}</button>
}