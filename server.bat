@echo off
%1 mshta vbscript:CreateObject("WScript.Shell").Run("%~s0 ::",0,FALSE)(window.close)&&exit
python Server.py
exit