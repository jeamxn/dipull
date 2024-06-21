"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const words = [
  "디미고",
  "인트라넷",
  "세탁",
  "건조",
  "기상송",
  "잔류",
  "외출",
  "금요귀가",
  "자습",
  "대나무숲"
];

const Login = () => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const login = async () => {
    const url = `${process.env.NEXT_PUBLIC_DIMIGOIN_URI}/oauth?client=${process.env.NEXT_PUBLIC_DIMIGOIN_KEY}&redirect=${window.location.origin}/auth`;
    router.push(url);
  };

  return (
    <>
      <div className="flex flex-row justify-between flex-wrap gap-10 items-center w-full h-screen fixed top-0 left-0 py-16 px-32 max-[650px]:px-8 max-[650px]:py-8 z-50">
        <div className="flex flex-col gap-6 max-[650px]:items-center max-[650px]:justify-center max-[650px]:w-full">
          <div className="flex flex-col gap-4 w-full max-[650px]:justify-center">
            <div className="flex flex-row gap-3 items-center max-[650px]:justify-center">
              <svg width="35" height="35" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1115_161)">
                  <path className="fill-primary" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" />
                  <path className="fill-primary" d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" />
                </g>
                <defs>
                  <clipPath id="clip0_1115_161">
                    <rect width="80" height="80" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-5xl text-primary font-semibold whitespace-nowrap max-[650px]:text-center">Dipull</p>
            </div>
            <p className="text-2xl text-text/60 font-medium break-words max-[650px]:text-center leading-normal">시간표, 세탁/건조, 잔류 신청까지 한 번에!</p>
          </div>
          <div className="flex flex-row gap-1 max-[650px]:flex-col items-center justify-center">
            <button
              className="bg-white w-min px-8 py-4 rounded-full border border-text/5 cursor-pointer flex flex-row gap-2 items-center justify-center select-none"
              onClick={login}
            >
              <p className="whitespace-nowrap text-base font-medium text-text/60">디풀 계정으로 로그인하기</p>
              <svg width="14" height="14" viewBox="0 0 750 750" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-text/60" d="M416.667 750C404.861 750 394.965 746.007 386.979 738.021C378.993 730.035 375 720.139 375 708.333C375 696.528 378.993 686.632 386.979 678.646C394.965 670.66 404.861 666.667 416.667 666.667H666.667V83.3333H416.667C404.861 83.3333 394.965 79.3403 386.979 71.3542C378.993 63.3681 375 53.4722 375 41.6667C375 29.8611 378.993 19.9653 386.979 11.9792C394.965 3.99306 404.861 0 416.667 0H666.667C689.583 0 709.201 8.15972 725.521 24.4792C741.84 40.7986 750 60.4167 750 83.3333V666.667C750 689.583 741.84 709.201 725.521 725.521C709.201 741.84 689.583 750 666.667 750H416.667ZM340.625 416.667H41.6667C29.8611 416.667 19.9653 412.674 11.9792 404.688C3.99306 396.701 0 386.806 0 375C0 363.194 3.99306 353.299 11.9792 345.313C19.9653 337.326 29.8611 333.333 41.6667 333.333H340.625L262.5 255.208C254.861 247.569 251.042 238.194 251.042 227.083C251.042 215.972 254.861 206.25 262.5 197.917C270.139 189.583 279.861 185.243 291.667 184.896C303.472 184.549 313.542 188.542 321.875 196.875L470.833 345.833C479.167 354.167 483.333 363.889 483.333 375C483.333 386.111 479.167 395.833 470.833 404.167L321.875 553.125C313.542 561.458 303.646 565.451 292.188 565.104C280.729 564.757 270.833 560.417 262.5 552.083C254.861 543.75 251.215 533.854 251.563 522.396C251.91 510.938 255.903 501.389 263.542 493.75L340.625 416.667Z" />
              </svg>
            </button>
            <Link
              className="bg-white w-min px-8 py-4 rounded-full border border-text/5 cursor-pointer flex flex-row gap-2 items-center justify-center select-none"
              href="https://github.com/jeamxn/dipull"
              target="_blank"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_476_120)"><path className="fill-text/60" d="M6.79297 15.5234C6.79297 15.6016 6.70312 15.6641 6.58984 15.6641C6.46094 15.6758 6.37109 15.6133 6.37109 15.5234C6.37109 15.4453 6.46094 15.3828 6.57422 15.3828C6.69141 15.3711 6.79297 15.4336 6.79297 15.5234ZM5.57813 15.3477C5.55078 15.4258 5.62891 15.5156 5.74609 15.5391C5.84766 15.5781 5.96484 15.5391 5.98828 15.4609C6.01172 15.3828 5.9375 15.293 5.82031 15.2578C5.71875 15.2305 5.60547 15.2695 5.57813 15.3477ZM7.30469 15.2813C7.19141 15.3086 7.11328 15.3828 7.125 15.4727C7.13672 15.5508 7.23828 15.6016 7.35547 15.5742C7.46875 15.5469 7.54687 15.4727 7.53516 15.3945C7.52344 15.3203 7.41797 15.2695 7.30469 15.2813ZM9.875 0.3125C4.45703 0.3125 0.3125 4.42578 0.3125 9.84375C0.3125 14.1758 3.03906 17.8828 6.93359 19.1875C7.43359 19.2773 7.60938 18.9688 7.60938 18.7148C7.60938 18.4727 7.59766 17.1367 7.59766 16.3164C7.59766 16.3164 4.86328 16.9023 4.28906 15.1523C4.28906 15.1523 3.84375 14.0156 3.20312 13.7227C3.20312 13.7227 2.30859 13.1094 3.26562 13.1211C3.26562 13.1211 4.23828 13.1992 4.77344 14.1289C5.62891 15.6367 7.0625 15.2031 7.62109 14.9453C7.71094 14.3203 7.96484 13.8867 8.24609 13.6289C6.0625 13.3867 3.85938 13.0703 3.85938 9.3125C3.85938 8.23828 4.15625 7.69922 4.78125 7.01172C4.67969 6.75781 4.34766 5.71094 4.88281 4.35937C5.69922 4.10547 7.57812 5.41406 7.57812 5.41406C8.35938 5.19531 9.19922 5.08203 10.0313 5.08203C10.8633 5.08203 11.7031 5.19531 12.4844 5.41406C12.4844 5.41406 14.3633 4.10156 15.1797 4.35937C15.7148 5.71484 15.3828 6.75781 15.2813 7.01172C15.9063 7.70313 16.2891 8.24219 16.2891 9.3125C16.2891 13.082 13.9883 13.3828 11.8047 13.6289C12.1641 13.9375 12.4688 14.5234 12.4688 15.4414C12.4688 16.7578 12.457 18.3867 12.457 18.707C12.457 18.9609 12.6367 19.2695 13.1328 19.1797C17.0391 17.8828 19.6875 14.1758 19.6875 9.84375C19.6875 4.42578 15.293 0.3125 9.875 0.3125ZM4.10937 13.7852C4.05859 13.8242 4.07031 13.9141 4.13672 13.9883C4.19922 14.0508 4.28906 14.0781 4.33984 14.0273C4.39062 13.9883 4.37891 13.8984 4.3125 13.8242C4.25 13.7617 4.16016 13.7344 4.10937 13.7852ZM3.6875 13.4687C3.66016 13.5195 3.69922 13.582 3.77734 13.6211C3.83984 13.6602 3.91797 13.6484 3.94531 13.5938C3.97266 13.543 3.93359 13.4805 3.85547 13.4414C3.77734 13.418 3.71484 13.4297 3.6875 13.4687ZM4.95313 14.8594C4.89063 14.9102 4.91406 15.0273 5.00391 15.1016C5.09375 15.1914 5.20703 15.2031 5.25781 15.1406C5.30859 15.0898 5.28516 14.9727 5.20703 14.8984C5.12109 14.8086 5.00391 14.7969 4.95313 14.8594ZM4.50781 14.2852C4.44531 14.3242 4.44531 14.4258 4.50781 14.5156C4.57031 14.6055 4.67578 14.6445 4.72656 14.6055C4.78906 14.5547 4.78906 14.4531 4.72656 14.3633C4.67188 14.2734 4.57031 14.2344 4.50781 14.2852Z"></path></g><defs><clipPath id="clip0_476_120"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>
              <p className="whitespace-nowrap text-base font-medium text-text/60">Github에 기여하기</p>
            </Link>
          </div>
          <p className="text-base text-text/30 max-[650px]:hidden">디풀 계정으로 로그인 시 <Link href="https://docs.dimigo.net/terms/privacy" target="_blank" className="underline">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.</p>
        </div>
        <div className="max-[650px]:w-full flex flex-col max-[650px]:items-center max-[650px]:justify-center">
          <svg className="w-64 w- h-64 max-[650px]:w-40"  viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1115_161)">
              <path className="fill-primary/5" d="M26.8382 18.3641C27.7759 19.3018 29.0477 19.8286 30.3738 19.8286H55.1723C57.9338 19.8286 60.1724 22.0671 60.1724 24.8286V49.6272C60.1724 50.9533 60.6991 52.2251 61.6368 53.1628L71.4654 62.9913C74.6152 66.1411 80.0009 63.9103 80.0009 59.4558V5C80.0009 2.23857 77.7623 0 75.0009 0H20.5452C16.0907 0 13.8598 5.38571 17.0097 8.53553L26.8382 18.3641Z" fill="#4054D6"/>
              <path className="fill-primary/5"  d="M53.1628 61.6368C52.2251 60.6991 50.9533 60.1724 49.6272 60.1724H24.8286C22.0672 60.1724 19.8286 57.9338 19.8286 55.1724V30.3738C19.8286 29.0477 19.3018 27.7759 18.3641 26.8382L8.53554 17.0097C5.38572 13.8598 0 16.0907 0 20.5452V75.0009C0 77.7624 2.23858 80.0009 5 80.0009H59.4558C63.9103 80.0009 66.1412 74.6152 62.9913 71.4654L53.1628 61.6368Z" fill="#4054D6"/>
            </g>
            <defs>
              <clipPath id="clip0_1115_161">
                <rect width="80" height="80" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <p className="text-base text-text/30 text-center min-[651px]:hidden px-4">디풀 계정으로 로그인 시 <Link href="https://docs.dimigo.net/terms/privacy" target="_blank" className="underline">개인정보처리방침</Link>에 동의하는 것으로 간주됩니다.</p>
        </div>
      </div>
      
    </>
  );
};

export default Login;