#!/usr/bin/env bash

if ! pgrep -f "proot" >/dev/null ; then termux-chroot ;fi
if ! pgrep "sshd" >/dev/null ; then sshd ; fi
