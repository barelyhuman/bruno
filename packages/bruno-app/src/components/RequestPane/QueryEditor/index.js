/**
 * GraphQL query editor — migrated to CodeMirror 6 with cm6-graphql.
 */

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useTheme } from 'styled-components';
import { format } from 'prettier/standalone';
import prettierPluginGraphql from 'prettier/parser-graphql';
import { keymap } from '@codemirror/view';
import { graphql, lint as graphqlLint, completion as graphqlCompletion, jump as graphqlJump, updateSchema } from 'cm6-graphql';
import { PLACEHOLDER } from 'utils/graphql/queryBuilder';
import toast from 'react-hot-toast';
import { PRESETS } from 'components/BrunoCodeEditor/presets';
import { useBrunoExtensions } from 'components/BrunoCodeEditor/useBrunoExtensions';
import { useBrunoCodeMirror } from 'components/BrunoCodeEditor/useBrunoCodeMirror';
import { setupLinkAware6 } from 'utils/codemirror6/extensions/linkAware';
import { setupCodeMirrorResizeRefresh } from 'utils/codemirror6/extensions/resizeRefresh';
import { createCm5Compat } from 'utils/codemirror6/compat';
import StyledWrapper from './StyledWrapper';

const AUTO_COMPLETE_AFTER_KEY = /^[a-zA-Z0-9_@(]$/;

const QueryEditor = forwardRef(function QueryEditor(
  {
    value = '',
    theme,
    readOnly = false,
    onEdit,
    schema,
    validationRules,
    externalFragments,
    onClickReference,
    onCopyQuery,
    onPrettifyQuery,
    onMergeQuery,
    font,
    fontSize
  },
  ref
) {
  const styledTheme = useTheme();
  const cleanupRef = useRef({});
  const compatRef = useRef(null);
  const wrapperRef = useRef(null);

  const graphqlExtensions = useMemo(() => {
    const opts = {
      schema,
      validationRules: validationRules ?? null,
      externalFragments: externalFragments ?? null
    };
    return [
      ...graphql(opts),
      graphqlLint,
      graphqlCompletion,
      graphqlJump({
        schema,
        onClick: (reference) => onClickReference?.(reference)
      }),
      keymap.of([
        { key: 'Shift-Mod-c', run: () => {
          onCopyQuery?.(); return true;
        } },
        { key: 'Shift-Mod-p', run: () => {
          onPrettifyQuery?.(); return true;
        } },
        { key: 'Shift-Mod-f', run: () => {
          onPrettifyQuery?.(); return true;
        } },
        { key: 'Shift-Mod-m', run: () => {
          onMergeQuery?.(); return true;
        } },
        { key: 'Mod-Enter', run: () => true }
      ])
    ];
  }, [schema, validationRules, externalFragments, onClickReference, onCopyQuery, onPrettifyQuery, onMergeQuery]);

  const extensions = useBrunoExtensions({
    preset: PRESETS.GRAPHQL,
    mode: 'graphql',
    theme,
    styledTheme,
    readOnly: readOnly ? 'nocursor' : false,
    font,
    fontSize,
    enableLint: true,
    extraExtensions: graphqlExtensions
  });

  const beautifyRequestBody = useCallback(() => {
    const compat = compatRef.current;
    if (!compat) return;
    try {
      const currentValue = compat.getValue();
      if (!currentValue?.trim()) return;
      let sanitized = currentValue.replace(/(:\s*)\{\s*\}/g, '$1{ __empty: true }');
      sanitized = sanitized.replace(/\{\s*\}/g, `{ ${PLACEHOLDER} }`);
      let prettyQuery = format(sanitized, { parser: 'graphql', plugins: [prettierPluginGraphql] });
      prettyQuery = prettyQuery.replace(new RegExp(`^\\s*${PLACEHOLDER}\\n`, 'gm'), '');
      prettyQuery = prettyQuery.replace(/\{\s*__empty:\s*true\s*\}/g, '{}');
      compat.setValue(prettyQuery);
      toast.success('Query prettified');
    } catch {
      toast.error('Error occurred while prettifying GraphQL query');
    }
  }, []);

  useImperativeHandle(ref, () => ({ beautifyRequestBody }), [beautifyRequestBody]);

  const handleChange = useCallback((newValue) => {
    onEdit?.(newValue);
  }, [onEdit]);

  const { viewRef, setContainer } = useBrunoCodeMirror({
    value,
    extensions,
    onChange: handleChange,
    onCreateEditor: (view) => {
      compatRef.current = createCm5Compat(view);
      cleanupRef.current.linkAware = setupLinkAware6(view);
      cleanupRef.current.resize = setupCodeMirrorResizeRefresh(view, wrapperRef.current);
      const keyupHandler = (compat, e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (AUTO_COMPLETE_AFTER_KEY.test(e.key)) {
          compat.execCommand('autocomplete');
        }
      };
      compatRef.current.on('keyup', keyupHandler);
      cleanupRef.current.keyup = () => compatRef.current?.off('keyup', keyupHandler);
    },
    readOnly: readOnly ? 'nocursor' : false
  });

  useEffect(() => {
    const view = viewRef.current;
    if (!view || !schema) return;
    view.dispatch({ effects: updateSchema(schema) });
  }, [schema, viewRef]);

  useEffect(() => {
    return () => {
      cleanupRef.current.linkAware?.();
      cleanupRef.current.resize?.();
      cleanupRef.current.keyup?.();
    };
  }, []);

  return (
    <StyledWrapper
      ref={wrapperRef}
      className="h-full w-full flex flex-col relative graphiql-container"
      aria-label="Query Editor"
      font={font}
      fontSize={fontSize}
    >
      <div className="bruno-cm6-editor h-full w-full" ref={setContainer} />
    </StyledWrapper>
  );
});

export default QueryEditor;
