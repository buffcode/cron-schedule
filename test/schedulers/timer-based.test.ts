import { parseCronExpression, TimerBasedCronScheduler } from '../../src'

jest.useFakeTimers()
const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

describe('TimerBasedCronScheduler', () => {
  afterEach(() => {
    jest.clearAllTimers()
    clearTimeoutSpy.mockClear()
  })

  test('setTimeout', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    TimerBasedCronScheduler.setTimeout(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('setTimeout shold correctly handle errors', () => {
    const cron = parseCronExpression('* * * * *')
    const task = () => {
      throw new Error('Test.')
    }
    const errorHandler = jest.fn()
    TimerBasedCronScheduler.setTimeout(cron, task, { errorHandler })

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(0)
  })

  test('setInterval', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    TimerBasedCronScheduler.setInterval(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(task).toHaveBeenCalledTimes(2)
    expect(jest.getTimerCount()).toBe(1)
  })

  test('setInterval shold correctly handle errors', () => {
    const cron = parseCronExpression('* * * * *')
    const task = () => {
      throw new Error('Test.')
    }
    const errorHandler = jest.fn()
    TimerBasedCronScheduler.setInterval(cron, task, { errorHandler })

    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(errorHandler).toHaveBeenCalledTimes(1)
    expect(jest.getTimerCount()).toBe(1)
    jest.runOnlyPendingTimers()
    expect(errorHandler).toHaveBeenCalledTimes(2)
    expect(jest.getTimerCount()).toBe(1)
  })

  test('clearTimeout', () => {
    const cron = parseCronExpression('* * * * *')
    const task = jest.fn()
    const handle = TimerBasedCronScheduler.setTimeout(cron, task)

    expect(jest.getTimerCount()).toBe(1)
    TimerBasedCronScheduler.clearTimeoutOrInterval(handle)
    expect(clearTimeout).toBeCalledWith(handle.timeoutId)
    expect(jest.getTimerCount()).toBe(0)
    expect(task).not.toBeCalled()
  })
})
