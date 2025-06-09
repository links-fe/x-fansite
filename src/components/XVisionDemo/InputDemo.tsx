'use client'
import { Input } from '@x-vision/design'
import React from 'react'

const InputDemo: React.FC = () => (
  <div className="theme-dark theme-light">
    <div className="text-2xl">size:</div>
    <div>moderate</div>
    <Input type="email" placeholder="Email" />
    <br />
    <div>generous</div>
    <Input type="email" placeholder="Email" size="generous" />
    <br />
    <div>huge</div>
    <Input type="email" placeholder="Email" size="huge" />

    <div className="text-2xl">position</div>
    <div>
      <span>left</span>
      <Input type="email" placeholder="Email" position="left" />
      <span>right</span>
      <Input type="email" placeholder="Email" position="right" />
      <span>center</span>
      <Input type="email" placeholder="Email" position="center" />
      <span>top</span>
      <Input type="email" placeholder="Email" position="top" />
      <span>bottom</span>
      <Input type="email" placeholder="Email" position="bottom" />
    </div>
    <span>readonly</span>
    <Input type="email" placeholder="Email" value="123" readOnly />
    <span>disabled</span>
    <Input type="email" placeholder="Email" disabled />
    <span>disabled--value</span>
    <Input type="email" placeholder="Email" value="123" disabled />
    <span>stop</span>
    <Input type="email" placeholder="Email" variant="stop" />
    <br />
    <Input type="email" placeholder="Email" variant="stop" disabled />
    <br />
    <Input type="email" placeholder="Email" value="123" variant="stop" disabled />
  </div>
)

export default InputDemo
