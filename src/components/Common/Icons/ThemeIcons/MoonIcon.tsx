const MoonIcon = ({ sticky, isHome }: { sticky: boolean; isHome: boolean }) => (
  <svg
    viewBox="0 0 23 23"
    className={`h-[30px] w-[30px] fill-current text-dark dark:hidden ${
      !sticky && isHome && "text-white"
    }`}
  >
    <g clipPath="url(#clip0_40_125)">
      <path d="M16.6111 15.855C17.591 15.1394 18.3151 14.1979 18.7723 13.1623C16.4824 13.4065 14.1342 12.4631 12.6795 10.4711C11.2248 8.47905 11.0409 5.95516 11.9705 3.84818C10.8449 3.9685 9.72768 4.37162 8.74781 5.08719C5.7759 7.25747 5.12529 11.4308 7.29558 14.4028C9.46586 17.3747 13.6392 18.0253 16.6111 15.855Z" />
    </g>
  </svg>
);

export default MoonIcon; 