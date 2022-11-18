import { Card, IconButton } from "@mui/material";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PaidIcon from "@mui/icons-material/Paid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import axios from "axios";

import { Avatar, Button, Text } from "@common/components";

import { ACCESS_TOKEN, ENDPOINT_API } from "@/api";
import { useAuth, useBottom, useHeader, useHobbyRoom } from "@/hooks";
import { HobbyRoomType } from "@/types";
import { useEffect } from "react";

export async function getServerSideProps({ params, query, req }) {
  const { regionId, hobbyId } = query;
  const accessToken = req.cookies[ACCESS_TOKEN];
  const hobbyRoomDefaultInfo = await axios.get(ENDPOINT_API + `/hobby/${hobbyId}/detail`, { headers: { authorization: `Bearer ${accessToken}` } }).then(({ data }) => {
    return data.data;
  });
  return {
    props: {
      hobbyRoomDefaultInfo,
    },
  };
}

const HobbyDetailPage = ({ hobbyRoomDefaultInfo }: { hobbyRoomDefaultInfo: HobbyRoomType }) => {
  const { hobbyRoomInfo, refetchHobbyRoomInfo } = useHobbyRoom(hobbyRoomDefaultInfo);
  const { highAgeLimit, rowAgeLimit, categoryId, closed, content, curNum, endDate, fee, hobbyId, imageurl, localId, maxNum, meetingPlace, sexLimit, title } = hobbyRoomInfo;
  useHeader({ mode: "ITEM" });
  const { isLogined } = useAuth();
  const { setBottom } = useBottom(<></>);
  useEffect(() => {
    isLogined &&
      setBottom({
        children: (
          <div
            css={css`
              position: fixed;
              bottom: 0;
              display: flex;
              width: 100%;
              justify-content: center;
              padding: 0.5rem;
            `}
          >
            <IconButton>
              <FavoriteIcon fontSize="large" />
            </IconButton>
            <Button
              css={css`
                width: 80%;
              `}
            >
              참여 신청하기
            </Button>
          </div>
        ),
      });
  }, [isLogined]);
  return (
    <div
      css={css`
        width: 100%;
        position: absolute;
      `}
    >
      <Image src={imageurl} alt={title} layout={"fill"} />
      <div
        css={css`
          position: relative;
          top: 20rem;
          display: flex;
          flex-direction: column;
          width: 90%;
          align-items: center;
          margin: auto;
        `}
      >
        <Card
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
            width: inherit;
          `}
        >
          <Avatar
            css={css`
              position: absolute;
              top: -2rem;
            `}
          />
          <Text
            css={css`
              display: block;
              font-size: 1.5rem;
            `}
          >
            {"사용자 이름"}
          </Text>
          <Text
            css={css`
              display: block;
              font-weight: bold;
              font-size: 1.5rem;
            `}
          >
            {title}
          </Text>
        </Card>
        <Text>{content}</Text>
        <div>
          <Text
            css={css`
              color: red;
              font-size: 1.2rem;
            `}
          >
            안내사항
          </Text>
          <div>
            <IconTextWrapper>
              <PeopleAltIcon />
              <Text>
                {curNum}/{maxNum}명
              </Text>
            </IconTextWrapper>
            <IconTextWrapper>
              <PaidIcon />
              <Text>{fee === 0 ? "무료" : fee}</Text>
            </IconTextWrapper>
            <IconTextWrapper>
              <CheckCircleIcon />
              <Text>
                {!!rowAgeLimit && rowAgeLimit + "세 이하"}/{!!highAgeLimit && highAgeLimit + "세 이상"}/{sexLimit === "f" ? "여자만" : sexLimit === "m" ? "남자만" : "무관"}
              </Text>
            </IconTextWrapper>
            <IconTextWrapper>
              <CalendarMonthIcon />
              <Text>{endDate}</Text>
            </IconTextWrapper>
            <IconTextWrapper>
              <LocationOnIcon />
              <Text>{meetingPlace}</Text>
            </IconTextWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

const IconTextWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export default HobbyDetailPage;
