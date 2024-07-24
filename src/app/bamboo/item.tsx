import { useRouter } from "next/navigation";
import React from "react";
import { useSetRecoilState } from "recoil";

import Mover from "@/components/Mover";
import { useAuth } from "@/hooks";
import { loadingAtom } from "@/utils/states";

const Item = ({
  href,
  title,
  name,
  time,
  like,
  dislike,
  comment,
  isFirst = false,
}: {
  href: string;
  title: string;
  name: string;
  time: string;
  like: number;
  dislike: number;
  comment: number;
  isFirst?: boolean;
  }) => {
  const setLoading = useSetRecoilState(loadingAtom);
  const { user, needLogin } = useAuth();
  const router = useRouter();
  return (
    <>
      <div className="w-full border-b border-text/10 dark:border-text-dark/20" />
      <Mover
        className="flex flex-col gap-3 py-3"
        onClick={() => {
          if (!user.id) {
            setLoading(false);
            needLogin();
            return;
          }
          router.push(href);
        }}
      >
        <div className="flex flex-col gap-1 items-start w-full overflow-hidden">
          <p className="text-base font-medium text-text dark:text-text-dark text-left whitespace-nowrap text-ellipsis w-full">{title}</p>
          <p className="text-sm font-normal text-text/50 dark:text-text-dark/60">{name} · {time}</p>
        </div>
        <div className="flex flex-row gap-3 items-center justify-start">
          <div className="flex flex-row gap-1 items-center justify-start">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_304_241" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="15">
                <rect y="0.0715332" width="14" height="14" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_304_241)">
                <path className="fill-text/50 dark:fill-text-dark/60" d="M4.20676 12.0298V5.01525L7.35227 1.94268C7.5168 1.77815 7.69479 1.67737 7.88624 1.64035C8.07769 1.60333 8.25306 1.63436 8.41235 1.73346C8.57164 1.83255 8.68381 1.98249 8.74887 2.18329C8.81395 2.38409 8.81806 2.6019 8.76121 2.83672L8.24969 5.01525H12.0122C12.2994 5.01525 12.5566 5.12893 12.784 5.35628C13.0113 5.58363 13.125 5.84089 13.125 6.12808V7.07036C13.125 7.13159 13.122 7.19719 13.116 7.26717C13.1101 7.33714 13.0925 7.39755 13.0633 7.44841L11.3916 11.3641C11.3177 11.5604 11.1809 11.7204 10.981 11.8441C10.7812 11.9679 10.5727 12.0298 10.3555 12.0298H4.20676ZM5.15467 5.40226V11.0965H10.3138C10.3549 11.0965 10.397 11.0853 10.44 11.0628C10.483 11.0404 10.5157 11.003 10.5382 10.9506L12.1917 7.11524V6.12808C12.1917 6.07572 12.1749 6.03272 12.1412 5.99906C12.1075 5.9654 12.0645 5.94857 12.0122 5.94857H7.05611L7.80211 2.80979L5.15467 5.40226ZM2.5712 12.0298C2.26517 12.0298 2.0032 11.9208 1.78527 11.7029C1.56734 11.485 1.45837 11.223 1.45837 10.917V6.12808C1.45837 5.82205 1.56734 5.56008 1.78527 5.34215C2.0032 5.12422 2.26517 5.01525 2.5712 5.01525H4.20676L4.22135 5.94857H2.5712C2.51884 5.94857 2.47584 5.9654 2.44218 5.99906C2.40852 6.03272 2.39169 6.07572 2.39169 6.12808V10.917C2.39169 10.9693 2.40852 11.0123 2.44218 11.046C2.47584 11.0797 2.51884 11.0965 2.5712 11.0965H4.22135V12.0298H2.5712Z" />
              </g>
            </svg>
            <p className="text-sm font-normal text-text/50 dark:text-text-dark/60">{like}개</p>
          </div>
          <div className="flex flex-row gap-1 items-center justify-start">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_304_246" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="15">
                <rect y="0.0715332" width="14" height="14" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_304_246)">
                <path className="fill-text/50 dark:fill-text-dark/60" d="M1.98787 9.12784C1.70069 9.12784 1.44342 9.01416 1.21608 8.7868C0.988733 8.55946 0.875061 8.3022 0.875061 8.01501V7.07272C0.875061 7.0115 0.878051 6.9459 0.88403 6.87592C0.890009 6.80595 0.907582 6.74554 0.936749 6.69468L2.60848 2.77897C2.68235 2.58272 2.81919 2.42272 3.01902 2.29894C3.21885 2.17517 3.42736 2.11328 3.64457 2.11328H9.79329V9.12784L6.64779 12.2004C6.48326 12.3649 6.30527 12.4657 6.11382 12.5027C5.92237 12.5398 5.747 12.5087 5.58771 12.4096C5.42842 12.3105 5.31625 12.1606 5.25118 11.9598C5.18611 11.759 5.182 11.5412 5.23885 11.3064L5.75037 9.12784H1.98787ZM8.84539 8.74082V3.0466H3.68626C3.64513 3.0466 3.60306 3.05782 3.56006 3.08026C3.51705 3.1027 3.48432 3.14009 3.46188 3.19245L1.80837 7.02785V8.01501C1.80837 8.06736 1.82519 8.11037 1.85885 8.14403C1.89251 8.17769 1.93552 8.19452 1.98787 8.19452H6.94394L6.19795 11.3333L8.84539 8.74082ZM11.4289 2.11328C11.7349 2.11328 11.9969 2.22225 12.2148 2.44018C12.4327 2.6581 12.5417 2.92008 12.5417 3.22611V8.01501C12.5417 8.32104 12.4327 8.58301 12.2148 8.80094C11.9969 9.01887 11.7349 9.12784 11.4289 9.12784H9.79329L9.77871 8.19452H11.4289C11.4812 8.19452 11.5242 8.17769 11.5579 8.14403C11.5915 8.11037 11.6084 8.06736 11.6084 8.01501V3.22611C11.6084 3.17375 11.5915 3.13075 11.5579 3.09709C11.5242 3.06343 11.4812 3.0466 11.4289 3.0466H9.77871V2.11328H11.4289Z" />
              </g>
            </svg>
            <p className="text-sm font-normal text-text/50 dark:text-text-dark/60">{dislike}개</p>
          </div>
          <div className="flex flex-row gap-1 items-center justify-start">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_304_251" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="15">
                <rect y="0.0715332" width="14" height="14" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_304_251)">
                <path className="fill-text/50 dark:fill-text-dark/60" d="M2.36099 7.53817C2.23802 7.53817 2.12974 7.49137 2.03618 7.39776C1.9426 7.30415 1.89581 7.19534 1.89581 7.07133C1.89581 6.94731 1.9426 6.83856 2.03618 6.74509C2.12974 6.65161 2.23802 6.60487 2.36099 6.60487H11.6389C11.7619 6.60487 11.8702 6.65167 11.9638 6.74527C12.0573 6.83889 12.1041 6.9477 12.1041 7.07171C12.1041 7.19572 12.0573 7.30447 11.9638 7.39795C11.8702 7.49143 11.7619 7.53817 11.6389 7.53817H2.36099ZM2.36018 10.3584C2.23774 10.3584 2.12974 10.3116 2.03618 10.2179C1.9426 10.1243 1.89581 10.0155 1.89581 9.89151C1.89581 9.76749 1.9426 9.65875 2.03618 9.56527C2.12974 9.47179 2.23774 9.42505 2.36018 9.42505H8.13975C8.26219 9.42505 8.37019 9.47186 8.46377 9.56547C8.55733 9.65908 8.60412 9.76789 8.60412 9.89191C8.60412 10.0159 8.55733 10.1247 8.46377 10.2181C8.37019 10.3116 8.26219 10.3584 8.13975 10.3584H2.36018ZM2.36099 4.71799C2.23802 4.71799 2.12974 4.67118 2.03618 4.57756C1.9426 4.48396 1.89581 4.37515 1.89581 4.25113C1.89581 4.12712 1.9426 4.01838 2.03618 3.9249C2.12974 3.83141 2.23802 3.78467 2.36099 3.78467H11.6389C11.7619 3.78467 11.8702 3.83148 11.9638 3.92509C12.0573 4.01871 12.1041 4.12752 12.1041 4.25152C12.1041 4.37554 12.0573 4.48429 11.9638 4.57777C11.8702 4.67125 11.7619 4.71799 11.6389 4.71799H2.36099Z" />
              </g>
            </svg>
            <p className="text-sm font-normal text-text/50 dark:text-text-dark/60">{comment}개</p>
          </div>
        </div>
      </Mover>
    </>
  );
};

export default Item;