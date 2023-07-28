'use client'

import {
  constitutionUpgradeAtom,
  statusLevelsAtom,
  type statusEffects,
} from '@/atoms/Constitution'
import ConstitutionData from '@/data/ConstituionData'
import ConstitutionMasteryData from '@/data/ConstitutionMasteryData'
import { useAtomValue } from 'jotai'

export default function ConstitutionStatsTable() {
  const levels = useAtomValue(statusLevelsAtom)
  const constUpgrade = useAtomValue(constitutionUpgradeAtom)

  const minLevel = Math.min(
    ...Object.values(levels).map((values) => values.from)
  )
  const myTierIndex = Math.ceil(minLevel / 5) - 1

  const initialTier = myTierIndex + 1
  const finalTier = (constUpgrade.masteryIteration.at(-1) ?? 0) + 1

  return (
    <div className="relative flex h-max max-w-xl shrink-0 flex-col rounded-md bg-primary-600 p-1 md:rounded-xl">
      <header>
        <h1 className="py-1 text-center text-lg font-medium text-white">
          Tier{' '}
          {finalTier > initialTier
            ? `${initialTier} > ${finalTier}`
            : initialTier}{' '}
          Constitution
        </h1>
      </header>
      <ul className="flex w-full grid-cols-4 flex-col text-sm font-normal text-white md:grid [&>li:nth-child(odd)]:bg-primary-500/20 [&>li:nth-child(odd)]:md:bg-transparent [&>li>p:first-child]:font-bold [&>li>p:last-child]:text-end [&>li>p]:px-2 [&>li>p]:py-1.5 [&>li>p]:sm:px-4 [&>li>p]:sm:py-2 [&>li]:flex [&>li]:items-center [&>li]:justify-between [&>li]:gap-2">
        <li className="col-span-2 md:!bg-primary-500/20">
          <p>PHYS DEF</p>
          <p>
            {getValuesFromAtom(
              getStatus('PHYS DEF', levels['PHYS DEF'].from, myTierIndex),
              getStatus('PHYS DEF', levels['PHYS DEF'].to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-2 md:!bg-primary-500/20">
          <p>Spell DEF</p>
          <p>
            {getValuesFromAtom(
              getStatus('Spell DEF', levels['Spell DEF'].from, myTierIndex),
              getStatus('Spell DEF', levels['Spell DEF'].to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-2">
          <p>HP</p>
          <p>
            {getValuesFromAtom(
              getStatus('HP', levels.HP.from, myTierIndex),
              getStatus('HP', levels.HP.to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-2">
          <p>MP</p>
          <p>
            {getValuesFromAtom(
              getStatus('MP', levels.MP.from, myTierIndex),
              getStatus('MP', levels.MP.to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-2 md:!bg-primary-500/20">
          <p>EVA</p>
          <p>
            {getValuesFromAtom(
              getStatus('EVA', levels.EVA.from, myTierIndex),
              getStatus('EVA', levels.EVA.to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-2 md:!bg-primary-500/20">
          <p>Accuracy</p>
          <p>
            {getValuesFromAtom(
              getStatus('Accuracy', levels.Accuracy.from, myTierIndex),
              getStatus('Accuracy', levels.Accuracy.to, myTierIndex)
            )}
          </p>
        </li>
        <li className="col-span-4 rounded-b-lg">
          <p>PHYS ATK & Spell ATK</p>
          <p>
            {getValuesFromAtom(
              getStatus('PHYS ATK', levels['PHYS ATK'].from, myTierIndex),
              getStatus('PHYS ATK', levels['PHYS ATK'].to, myTierIndex)
            )}
          </p>
        </li>
      </ul>
    </div>
  )
}

function getValuesFromAtom(initialStatus: number, endStatus: number) {
  return endStatus > initialStatus ? (
    <>
      {initialStatus} <span className="text-[#62CA63]">{`> ${endStatus}`}</span>
    </>
  ) : (
    initialStatus
  )
}

function getStatus(status: statusEffects, index: number, tierIndex: number) {
  return (
    ((ConstitutionData[status].at(index - 1) as any)[status] as number) +
    ConstitutionMasteryData[tierIndex].Effects[status]
  )
}
