'use client'

import { XPCalculatorAtom, XPInvalidInput } from '@/atoms/XPCalculator'
import Input from '@/components/Input'
import XPPerLevel from '@/data/XPPerLevel'
import {
  formatForExperience,
  getPercentage,
  getReadableNumber,
  getValidNumber,
} from '@/utils/index'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from '../../../public/locales/client'

export default function PercentageDifference() {
  const [{ levels, percentages, manualCalculation }, setXPCalc] =
    useAtom(XPCalculatorAtom)
  const [invalidInput, setIsInvalid] = useAtom(XPInvalidInput)
  const { t } = useTranslation()

  useEffect(() => {
    if (levels.initial !== undefined) {
      setXPCalc((prev) => ({
        ...prev,
        xpPerMinute: levels.initial
          ? getPercentage(
              XPPerLevel[levels.initial],
              (Number(levels.initialPercentage ?? percentages.final) -
                Number(percentages.initial)) /
                5
            )
          : prev.xpPerMinute,
      }))
    }
  }, [
    levels.initial,
    levels.initialPercentage,
    percentages.final,
    percentages.initial,
    setXPCalc,
  ])

  const handleInvalid = () => {
    setXPCalc((prev) => ({
      ...prev,
      manualCalculation: { xpPerMinute: undefined },
    }))
    setXPCalc((prev) => ({
      ...prev,
      levels: { ...prev.levels, initialPercentage: undefined },
    }))
    if (
      percentages.initial &&
      percentages.final &&
      Number(percentages.initial) >= Number(percentages.final)
    ) {
      setIsInvalid(true)
    } else setIsInvalid(false)
  }

  const resetPercentages = () => {
    setXPCalc((prev) => ({
      ...prev,
      percentages: { initial: undefined, final: undefined },
    }))
  }

  return (
    <div id="percentageDifference" className="flex flex-col !w-max gap-3">
      <div id="experienceTimerInput" className={'mt-8 flex'}>
        <Input
          placeholder="Start"
          label={t('Before Timer')}
          onChange={(value) => {
            setXPCalc((prev) => ({
              ...prev,
              percentages: {
                ...prev.percentages,
                initial: formatForExperience(value),
              },
            }))
          }}
          value={percentages.initial ?? ''}
          suffix="%"
          onBlur={handleInvalid}
          error={!!invalidInput}
          className="max-w-[10rem] [&>div]:rounded-r-none [&>div]:border-r-2 [&>div]:border-r-primary-500"
        />
        <Input
          suffix="%"
          placeholder="End"
          label={t('After Timer')}
          onChange={(value) => {
            setXPCalc((prev) => ({
              ...prev,
              percentages: {
                ...prev.percentages,
                final: formatForExperience(value),
              },
            }))
          }}
          value={percentages.final ?? ''}
          onBlur={handleInvalid}
          error={!!invalidInput}
          className="max-w-[10rem] [&>div]:rounded-l-none"
        />
      </div>

      <div className="flex items-center gap-3 px-8">
        <span className="h-[2px] w-full rounded-full bg-primary-100" />
        <p className="text-2xl font-bold text-primary-100">OR</p>
        <span className="h-[2px] w-full rounded-full bg-primary-100" />
      </div>

      <div id="experienceXPRateInput" className={'mb-2 flex'}>
        <Input
          suffix="XP"
          label={t('XP Per Minute')}
          onChange={(value) => {
            setXPCalc((prev) => ({
              ...prev,
              manualCalculation: { xpPerMinute: getValidNumber(value, 0) },
            }))
          }}
          value={getReadableNumber(manualCalculation.xpPerMinute ?? 0)}
          onBlur={resetPercentages}
          className="max-w-[10rem] [&>div]:rounded-r-none [&>div]:border-r-2 [&>div]:border-r-primary-500"
        />
        <Input
          suffix="%"
          placeholder="0.0000"
          label={t('Current Percentage')}
          onChange={(value) => {
            setXPCalc((prev) => ({
              ...prev,
              levels: {
                ...prev.levels,
                initialPercentage: formatForExperience(value),
              },
            }))
          }}
          value={levels.initialPercentage ?? ''}
          onBlur={resetPercentages}
          className="max-w-[10rem] [&>div]:rounded-l-none"
        />
      </div>
    </div>
  )
}
