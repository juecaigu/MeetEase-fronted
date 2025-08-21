const Loading = () => {
  const bar = 'w-[3px] h-[20px] bg-white-500 animate-loading-bar rounded-[10px]'
  return (
    <div className="flex items-center justify-center w-full h-full bg-black-100">
      <div className="flex items-center">
        <span className={`${bar}`}></span>
        <span className={`${bar} delay-custom-250 ml-[5px] mr-[5px] h-[28px]`}></span>
        <span className={`${bar} delay-custom-500`}></span>
      </div>
    </div>
  )
}

export default Loading
