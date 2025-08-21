import React, { useState, useCallback, useEffect } from 'react'
import { Button, Statistic } from 'antd'
import type { ButtonProps } from 'antd'

const { Timer } = Statistic

interface TimerButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** 倒计时时长（毫秒） */
  countdownDuration: number
  /** 倒计时结束后的回调函数 */
  onCountdownEnd?: () => void
  /** 倒计时时按钮显示的文本 */
  countdownText?: string
  /** 正常时按钮显示的文本 */
  normalText: string
  /** 正常时按钮点击事件 */
  onClick?: () => void
  /** 是否启用倒计时功能 */
  enableCountdown?: boolean
  /** 倒计时存储的唯一标识，用于区分多个倒计时按钮 */
  countdownKey?: string
}

const TimerButton: React.FC<TimerButtonProps> = ({
  countdownDuration,
  onCountdownEnd,
  countdownText,
  normalText,
  onClick,
  enableCountdown = true,
  countdownKey = 'default',
  disabled,
  loading,
  ...buttonProps
}) => {
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [targetTime, setTargetTime] = useState<number>(0)

  // 生成存储键名
  const storageKey = `countdown_${countdownKey}`
  const targetTimeKey = `targetTime_${countdownKey}`

  // 页面加载时检查是否有未完成的倒计时
  useEffect(() => {
    if (!enableCountdown) return

    const savedTargetTime = localStorage.getItem(targetTimeKey)
    if (savedTargetTime) {
      const target = parseInt(savedTargetTime)
      const now = Date.now()

      // 如果目标时间还没到，继续倒计时
      if (target > now) {
        setTargetTime(target)
        setIsCountingDown(true)
      } else {
        // 倒计时已结束，清理存储
        localStorage.removeItem(targetTimeKey)
        localStorage.removeItem(storageKey)
      }
    }
  }, [enableCountdown, targetTimeKey, storageKey])

  // 开始倒计时
  const startCountdown = useCallback(() => {
    if (!enableCountdown) return

    const endTime = Date.now() + countdownDuration
    setTargetTime(endTime)
    setIsCountingDown(true)

    // 保存到localStorage
    localStorage.setItem(targetTimeKey, endTime.toString())
    localStorage.setItem(storageKey, 'true')
  }, [countdownDuration, enableCountdown, targetTimeKey, storageKey])

  // 倒计时结束处理
  const handleCountdownEnd = useCallback(() => {
    setIsCountingDown(false)

    // 清理localStorage
    localStorage.removeItem(targetTimeKey)
    localStorage.removeItem(storageKey)

    onCountdownEnd?.()
  }, [onCountdownEnd, targetTimeKey, storageKey])

  // 按钮点击处理
  const handleClick = useCallback(async () => {
    if (isCountingDown) return
    await onClick?.()
    // 如果启用了倒计时，先开始倒计时
    if (enableCountdown) {
      startCountdown()
    }
  }, [isCountingDown, enableCountdown, startCountdown, onClick])

  // 渲染倒计时内容
  const renderCountdownContent = () => {
    if (!isCountingDown) {
      return normalText
    }

    return (
      <div className="flex items-center gap-2">
        <span>{countdownText || '倒计时'}</span>
        <Timer
          type="countdown"
          value={targetTime}
          format="ss"
          onFinish={handleCountdownEnd}
          valueStyle={{
            fontSize: '14px',
            fontWeight: 'normal',
            color: 'inherit',
          }}
        />
        <span>秒</span>
      </div>
    )
  }

  return (
    <Button
      {...buttonProps}
      disabled={disabled || isCountingDown}
      loading={loading && !isCountingDown}
      onClick={handleClick}
      className={`countdown-button ${isCountingDown ? 'counting-down' : ''}`}
    >
      {renderCountdownContent()}
    </Button>
  )
}

export default TimerButton
