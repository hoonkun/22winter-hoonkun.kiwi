// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Arrays } from "../../utils/Array";


const Randoms: Data[] = [
  { text: "고훈 군은 가끔 떡볶이를 좋아합니다.\n가끔이요.", image: "bbokki.png", duration: 3500 },
  { text: "고훈 군은 마인크래프트를 즐겨 합니다.\n같이할 사람 절찬리에 모집 중!", image: "command_block_front_big.png", duration: 5000 },
  { text: "감자튀김 최고! 너희도 같이 이 감자튀김 먹자!", image: "fries.png", duration: 4000 },
  { text: "이건 야채야, 야채라고! 그 몸에 좋다는 야채라고!!", image: "fries_2.png", duration: 4000 },
  { text: "가끔은 핫도그도 괜찮지.\n갈 때마다 가격이 올라있어서 슬플 뿐이야.", image: "hotdog.png", duration: 4500 },
  { text: "즐거운 밤샘코딩! Happy AllNight Hacking!!", image: "monster.png", duration: 3500 },
  { text: "고훈 군은 가끔 인싸들과 놀러갑니다.\n피곤하지만 재밌습니다.", image: "pegoen.png", duration: 4500 },
  { text: "비둘. 비둘비둘. 비둘빔 비둘비둘. 삐약.", image: "pigeon.png", duration: 3500 },
  { text: "고훈 군은 가끔 라멘을 좋아합니다.\n치지에 숙주만 빼고 나머지는 보통으로 해주세요!", image: "ramen.png", duration: 5000 },
  { text: "고훈 군은 가끔 라멘을 좋아합니다.\n치지에 숙주만 빼고 나머지는 보통으로 해주세요!", image: "ramen_2.png", duration: 5000 },
  { text: "영원히 고통받는 고훈 군입니다.", image: "suffering.png", duration: 3500 }
]

type Data = {
  text: string
  image: string
  duration: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(Arrays().random(Randoms))
}
