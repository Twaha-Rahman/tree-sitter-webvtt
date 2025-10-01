#!/bin/bash

tree-sitter generate

cp ./queries/highlights.scm ~/.local/share/nvim/lazy/nvim-treesitter/queries/webvtt/highlights.scm

tree-sitter test
