import { useNavigate } from "react-router-dom";


const SideBar:React.FC=()=> {
  const navigate=useNavigate();
  return (
    <div
  className="relative flex h-full w-full max-w-[20rem] flex-col rounded-xl bg-gray-100 bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
  <div className="p-4 mb-2">
    <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      সপোন<span className='font-bold'> Task</span>
    </h5>
  </div>
  <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
    <button
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-500 active:bg-opacity-80 active:text-blue-900"
      onClick={()=>{navigate("/home")}}>
      <div className="grid mr-4 place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className="w-5 h-5">
          <path fill-rule="evenodd"
            d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      Dashboard
    </button>
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-900"
      onClick={()=>{navigate("/home/projects")}}>
      <div className="grid mr-4 place-items-center">
       <svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="black" 
  viewBox="0 0 24 24" 
  className="w-6 h-6"
>
  <path d="M10 4H4a2 2 0 0 0-2 2v12c0 1.103.897 2 2 2h7.764A6.965 6.965 0 0 1 11 18c0-.341.034-.675.086-1H4V6h6v2h6v2.062c.629.138 1.218.379 1.752.699L22 6.414V14a6.978 6.978 0 0 1 2 2.239V4a2 2 0 0 0-2-2h-8l-2 2z"/>
  <path d="M23 18a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm-4.045-2.916l.52-.916a.25.25 0 0 0-.217-.368h-1.716a.25.25 0 0 0-.217.368l.52.916a2.993 2.993 0 0 0-1.33 1.165l-.916-.52a.25.25 0 0 0-.368.217v1.716c0 .2.216.325.401.217l.916-.52a2.993 2.993 0 0 0 1.165 1.33l-.52.916a.25.25 0 0 0 .217.368h1.716c.2 0 .325-.216.217-.401l-.52-.916a2.993 2.993 0 0 0 1.33-1.165l.916.52c.185.107.401-.017.401-.217v-1.716a.25.25 0 0 0-.368-.217l-.916.52a2.993 2.993 0 0 0-1.165-1.33z"/>
</svg>
      </div>
      Projects
    </div>
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-900">
      <div className="grid mr-4 place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className="w-5 h-5">
          <path fill-rule="evenodd"
            d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      Inbox
      <div className="grid ml-auto place-items-center justify-self-end">
        <div
          className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
          <span className="">1</span>
        </div>
      </div>
    </div>
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-900">
      <div className="grid mr-4 place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className="w-5 h-5">
          <path fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      Profile
    </div>
    <div role="button"
      className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-900">
      <div className="grid mr-4 place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className="w-5 h-5">
          <path fill-rule="evenodd"
            d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      Settings
    </div>
    <div role="button"
      className="flex ml-0 bottom-0 mt-80  items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start  hover:bg-gray-300 hover:bg-opacity-80 hover:text-blue-700 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-900">
      <div className="grid mr-4 place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          className="w-5 h-5">
          <path fill-rule="evenodd"
            d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      Log Out
    </div>
  </nav>
</div>
  )
}
export default SideBar