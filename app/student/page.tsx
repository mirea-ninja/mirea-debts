import Image from "next/image"
import { redirect } from "next/navigation"

import {
  getAllRetakesByDebtsDisciplines,
  getConnectedSocialNetworks,
  getOwnDebtsDisciplines,
  getSession,
} from "@/lib/supabase/supabase-server"
import TelegramApi from "@/lib/telegram-api"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import DebtsCard from "./DebtsCard"
import { OnlineEduDisciplinesCard } from "./OnlineEduDisciplinesCard"
import { ResourceCard } from "./ResourceCard"
import { SelfRetakesTable } from "./SelfRetakesTable"
import { TelegramConnectionCard } from "./TelegramConnectionCard"

export const dynamic = "force-dynamic"

export default async function Student() {
  const session = await getSession()

  if (!session?.user) redirect("/login")

  const debts = await getOwnDebtsDisciplines()

  const retakes = await getAllRetakesByDebtsDisciplines(
    (debts ?? []).map((debt) => debt.name)
  )

  const connectedSocialNetweork = await getConnectedSocialNetworks()

  await TelegramApi.initCallback()

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Привет, {session.user.user_metadata.name}
          </h2>
          <p className="text-muted-foreground">
            Здесь вы можете посмотреть расписание пересдач и информацию о
            задолженностях.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* <YearDebtAlert /> */}
        <div className="grid gap-4 md:grid-cols-2">
          <DebtsCard debts={debts ?? []} />
          <div className="grid gap-4 md:grid-cols-2">
            <OnlineEduDisciplinesCard />
            <TelegramConnectionCard
              user={session.user}
              telegram={connectedSocialNetweork}
            />
          </div>
        </div>

        <SelfRetakesTable retakes={retakes} />
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Дополнительные возможности
          </h2>
          <p className="text-sm text-muted-foreground">
            Подборка интересных и полезных ресурсов, чтобы тебе было легче.
          </p>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              <ResourceCard
                title="Учебные субботы"
                description="Помогут тебе повысить знания по учебе"
                image="/images/us.jpg"
                href="https://vk.com/education_sumirea"
              />
              <ResourceCard
                title="Расписание преподавателей"
                description="Бот поможет тебе найти преподавателя"
                image="/images/teachers-schedule-bot.jpg"
                href="https://t.me/mirea_teachers_bot"
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
