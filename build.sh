#!/bin/bash

tree-sitter generate

cp ./queries/highlights.scm ~/.local/share/nvim/lazy/nvim-treesitter/queries/webvtt/highlights.scm
cp ./queries/injections.scm ~/.local/share/nvim/lazy/nvim-treesitter/queries/webvtt/injections.scm

tree-sitter test
