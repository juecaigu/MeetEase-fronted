const Loading = () => {
  const circle = 'w-[16px] h-[16px] rounded-full bg-primary absolute left-[15%] animate-loading-circle'
  const shadow = `w-[16px] h-[2px] rounded-full bg-[rgba(0,0,0,0.9)] absolute 
  top-[62px] left-[15%] origin-bottom-left -z-1 blur-[2px] animate-loading-shadow`
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-[180px] h-[60px] relative z-1">
        <div className={`${circle}`}></div>
        <div className={`${circle} delay-custom-200 left-[45%]`}></div>
        <div className={`${circle} delay-custom-300 left-auto right-[15%]`}></div>
        <div className={`${shadow}`}></div>
        <div className={`${shadow} delay-custom-200 left-[45%]`}></div>
        <div className={`${shadow} delay-custom-300 left-auto right-[15%]`}></div>
      </div>
    </div>
  )
}

export default Loading
