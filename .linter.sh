#!/bin/bash
cd /home/kavia/workspace/code-generation/quizgenie-ai-105406-b8f88027/quizgenie_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

