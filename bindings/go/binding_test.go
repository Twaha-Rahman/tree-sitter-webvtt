package tree_sitter_webvtt_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_webvtt "github.com/tree-sitter/tree-sitter-webvtt/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_webvtt.Language())
	if language == nil {
		t.Errorf("Error loading WebVTT grammar")
	}
}
