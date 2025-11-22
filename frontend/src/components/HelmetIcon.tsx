import * as React from "react";
import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

export default function HelmetIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 512 512" {...props}>
      <g fill="none" stroke="none">
        <path
          d="M256 64c-70 0-128 58-128 128v32H96c-17.7 0-32 14.3-32 32v48c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32v-48c0-17.7-14.3-32-32-32h-32v-32c0-70-58-128-128-128z"
          fill="#F4A426"
        />
        <path
          d="M128 224c0-61 44-112 102-123-18 26-30 70-30 123h-72z"
          fill="#E28F18"
        />
        <path d="M256 101c18 26 30 70 30 123h-60c0-53 12-97 30-123z" fill="#E28F18" />
        <path d="M354 101c18 26 30 70 30 123h-72c0-53 12-97 42-123z" fill="#E28F18" />
        <path d="M80 304h352v32c0 13-11 24-24 24H104c-13 0-24-11-24-24v-32z" fill="#D17A11" />
        <path d="M80 304h352v16H80z" fill="#C56D0C" />
        <path
          d="M256 64c-70 0-128 58-128 128v16c0-70 58-128 128-128s128 58 128 128v-16c0-70-58-128-128-128z"
          fill="#000"
          opacity="0.12"
        />
      </g>
    </SvgIcon>
  );
}
