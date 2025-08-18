import { ConfigProvider } from 'antd'
import React from 'react'

const CustomTheme = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 36,
        },
        components: {
          Input: {
            inputFontSizeLG: 14,
          },
          Button: {
            contentFontSizeLG: 14,
          },
          Form: {
            labelFontSize: 14,
            labelColor: 'var(--color-normal-text)',
            itemMarginBottom: 12,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default CustomTheme
