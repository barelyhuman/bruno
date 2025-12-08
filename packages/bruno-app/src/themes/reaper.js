const colors = {
  BRAND: '#666666',
  TEXT: '#d4d4d4',
  TEXT_LINK: '#efefef',
  BACKGROUND: '#181819',

  GRAY_1: '#666666',
  GRAY_2: '#3D3D3D',
  GRAY_3: '#252526',

  CODEMIRROR_TOKENS: {
    DEFINITION: '#d4d4d4', // Softer, brighter sage — better contrast
    PROPERTY: '#efefef', // Soft sky blue, high clarity without being loud
    STRING: '#d4d4d4', // VSCode-like warm string tone
    NUMBER: '#d4d4d4', // Standard teal with higher clarity
    ATOM: '#d4d4d4', // Brighter lavender, matches VSCode purple
    VARIABLE: '#efefef', // Clear aqua-blue (used widely in dark themes)
    KEYWORD: '#666666', // Coral-ish but muted to avoid eye strain
    COMMENT: '#3D3D3D', // Greenish-slate — very readable & subtle
    OPERATOR: '#d4d4d4' // Light gray — consistent with dark mode operators
  }
};

const reaperTheme = {
  brand: colors.BRAND,
  text: colors.TEXT,
  textLink: colors.TEXT_LINK,
  bg: colors.BACKGROUND,

  font: {
    size: {
      xs: '0.6875rem', // 11px
      sm: '0.75rem', // 12px
      base: '0.8125rem', // 13px
      md: '0.875rem', // 14px
      lg: '1rem', // 16px
      xl: '1.125rem' // 18px
    }
  },

  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.4)',
    lg: '0 2px 12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.4)'
  },

  border: {
    radius: {
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '10px',
      xl: '12px'
    }
  },

  colors: {
    text: {
      white: '#fff',
      green: '#d4d4d4',
      danger: '#252526',
      muted: '#666666',
      purple: '#d4d4d4',
      yellow: '#d4d4d4',
      darkOrange: '#d4d4d4'
    },
    bg: {
      lightYellow: '#3D3D3D',
      danger: '#181819'
    }
  },

  listItem: {
    hoverBg: '#3D3D3D',
    activeBg: '#666666'
  },

  input: {
    bg: '#3D3D3D',
    border: '#3D3D3D',
    focusBorder: '#666666',
    placeholder: {
      color: '#666666',
      opacity: 0.75
    }
  },

  variables: {
    bg: '#252526',

    name: {
      color: '#d4d4d4'
    },

    runtime: {
      color: '#ffffff'
    }
  },

  menubar: {
    bg: '#252526'
  },

  info: {
    bg: '#252526',
    color: '#d4d4d4',
    border: '#3D3D3D'
  },
  sidebar: {
    color: '#d4d4d4',
    muted: '#666666',
    bg: colors.BACKGROUND,
    dragbar: {
      border: 'transparent',
      activeBorder: colors.GRAY_1
    },

    badge: {
      bg: '#3D3D3D'
    },

    search: {
      border: '1px solid transparent',
      bg: '#3D3D3D'
    },

    collection: {
      item: {
        bg: '#252526',
        hoverBg: colors.BACKGROUND,
        keyboardFocusBg: 'rgba(102, 102, 102, 0.2)',
        indentBorder: 'solid 1px #666666',
        active: {
          indentBorder: 'solid 1px #3D3D3D'
        }
      }
    },

    dropdownIcon: {
      color: '#d4d4d4'
    }
  },

  welcome: {
    heading: '#d4d4d4',
    muted: '#666666'
  },

  dropdown: {
    color: '#d4d4d4',
    iconColor: '#d4d4d4',
    bg: '#252526',
    hoverBg: '#3D3D3D',
    shadow: 'rgb(0 0 0 / 36%) 0px 2px 8px',
    separator: '#3D3D3D',
    labelBg: '#252526',
    selectedBg: '#666666',
    selectedColor: '#ffffff',
    mutedText: '#666666',
    primaryText: '#d4d4d4',
    secondaryText: '#666666',
    headingText: '#ffffff'
  },

  listItem: {
    hoverBg: '#3D3D3D',
    activeBg: '#666666'
  },

  workspace: {
    accent: '#d4d4d4',
    border: '#3D3D3D',
    borderMuted: '#666666',
    card: {
      bg: '#252526'
    },
    button: {
      bg: '#181819'
    },
    collection: {
      header: {
        indentBorder: 'solid 1px #3D3D3D'
      },
      item: {
        indentBorder: 'solid 1px #252526'
      }
    },
    environments: {
      bg: '#181819',
      indentBorder: 'solid 1px #252526',
      activeBg: '#252526',
      search: {
        bg: '#3D3D3D'
      }
    }
  },

  request: {
    methods: {
      get: '#d4d4d4',
      post: '#d4d4d4',
      put: '#d4d4d4',
      delete: '#252526',
      // customize these colors if needed
      patch: '#d4d4d4',
      options: '#d4d4d4',
      head: '#d4d4d4'
    },
    grpc: '#d4d4d4',
    ws: '#d4d4d4',
    gql: '#d4d4d4'
  },

  requestTabPanel: {
    url: {
      bg: colors.BACKGROUND,
      icon: '#d4d4d4',
      iconDanger: '#ff0000',
      errorHoverBg: '#181819',
      border: `solid 1px ${colors.GRAY_2}`
    },
    dragbar: {
      border: '#3D3D3D',
      activeBorder: '#666666'
    },
    bodyModeSelect: {
      color: 'transparent'
    },
    responseSendIcon: '#666666',
    responseStatus: '#d4d4d4',
    responseOk: '#d4d4d4',
    responseError: '#252526',
    responsePending: '#d4d4d4',
    responseOverlayBg: 'rgba(24, 24, 25, 0.6)',

    card: {
      bg: '#252526',
      border: 'transparent',
      borderDark: '#d4d4d4',
      hr: '#3D3D3D'
    },

    cardTable: {
      border: '#252526',
      bg: '#252526',
      table: {
        thead: {
          bg: '#3D3D3D',
          color: '#d4d4d4'
        }
      }
    },
    graphqlDocsExplorer: {
      bg: '#181819',
      color: '#d4d4d4'
    }
  },

  collection: {
    environment: {
      bg: '#3D3D3D',

      settings: {
        bg: '#3D3D3D',
        sidebar: {
          bg: '#3D3D3D',
          borderRight: '#666666'
        },
        item: {
          border: '#d4d4d4',
          hoverBg: 'transparent',
          active: {
            bg: 'transparent',
            hoverBg: 'transparent'
          }
        },
        gridBorder: '#666666'
      }
    }
  },

  notifications: {
    bg: '#3D3D3D',
    list: {
      bg: '#3D3D3D',
      borderRight: '#666666',
      borderBottom: '#666666',
      hoverBg: '#252526',
      active: {
        border: '#d4d4d4',
        bg: '#666666',
        hoverBg: '#666666'
      }
    }
  },

  modal: {
    title: {
      color: '#d4d4d4',
      bg: '#252526',
      iconColor: '#d4d4d4'
    },
    body: {
      color: '#d4d4d4',
      bg: '#252526'
    },
    input: {
      bg: '#3D3D3D',
      border: '#3D3D3D',
      focusBorder: '#3D3D3D'
    },
    backdrop: {
      opacity: 0.2
    }
  },

  button: {
    secondary: {
      color: '#d4d4d4',
      bg: '#252526',
      border: '#252526',
      hoverBorder: '#666666'
    },
    close: {
      color: '#d4d4d4',
      bg: 'transparent',
      border: 'transparent',
      hoverBorder: ''
    },
    disabled: {
      color: '#666666',
      bg: '#252526',
      border: '#252526'
    },
    danger: {
      color: '#ff0000',
      bg: '#181819',
      border: '#181819'
    }
  },

  tabs: {
    active: {
      color: '#d4d4d4',
      border: '#d4d4d4'
    },
    secondary: {
      active: {
        bg: '#252526',
        color: '#d4d4d4'
      },
      inactive: {
        bg: '#3D3D3D',
        color: '#d4d4d4'
      }
    }
  },

  requestTabs: {
    color: '#d4d4d4',
    bg: '#252526',
    bottomBorder: '#3D3D3D',
    icon: {
      color: '#666666',
      hoverColor: '#d4d4d4',
      hoverBg: '#181819'
    },
    active: {
      bg: '#3D3D3D'
    },
    shortTab: {
      color: '#d4d4d4',
      bg: 'transparent',
      hoverColor: '#d4d4d4',
      hoverBg: '#3D3D3D'
    }
  },

  codemirror: {
    bg: colors.BACKGROUND,
    border: colors.BACKGROUND,
    placeholder: {
      color: '#666666',
      opacity: 0.5
    },
    gutter: {
      bg: colors.BACKGROUND
    },
    variable: {
      valid: '#d4d4d4',
      invalid: '#252526',
      prompt: '#666666',
      info: {
        color: '#FFFFFF',
        bg: '#252526',
        boxShadow: 'rgb(0 0 0 / 36%) 0px 2px 8px',
        editorBg: '#181819',
        iconColor: '#666666',
        editorBorder: '#3D3D3D',
        editorFocusBorder: '#d4d4d4',
        editableDisplayHoverBg: 'rgba(239,239,239,0.03)',
        border: '#666666',
        editorBorder: '#3D3D3D'
      }
    },
    tokens: {
      definition: colors.CODEMIRROR_TOKENS.DEFINITION,
      property: colors.CODEMIRROR_TOKENS.PROPERTY,
      string: colors.CODEMIRROR_TOKENS.STRING,
      number: colors.CODEMIRROR_TOKENS.NUMBER,
      atom: colors.CODEMIRROR_TOKENS.ATOM,
      variable: colors.CODEMIRROR_TOKENS.VARIABLE,
      keyword: colors.CODEMIRROR_TOKENS.KEYWORD,
      comment: colors.CODEMIRROR_TOKENS.COMMENT,
      operator: colors.CODEMIRROR_TOKENS.OPERATOR
    },
    searchLineHighlightCurrent: 'rgba(102,102,102,0.18)',
    searchMatch: '#efefef',
    searchMatchActive: '#ffffff'
  },

  table: {
    border: '#252526',
    thead: {
      color: '#d4d4d4'
    },
    striped: '#252526',
    input: {
      color: '#d4d4d4'
    }
  },

  plainGrid: {
    hoverBg: '#3D3D3D'
  },

  scrollbar: {
    color: '#252526'
  },

  preferences: {
    sidebar: {
      bg: '#181819',
      borderRight: 'transparent'
    }
  },

  dragAndDrop: {
    border: '#666666',
    borderStyle: '2px solid',
    hoverBg: 'rgba(102, 102, 102, 0.08)',
    transition: 'all 0.1s ease'
  },

  tooltip: {
    bg: '#181819',
    color: '#ffffff',
    shortcutColor: '#d4d4d4'
  },

  infoTip: {
    bg: '#181819',
    border: '#252526',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },

  statusBar: {
    border: '#252526',
    color: '#666666'
  },

  console: {
    bg: '#181819',
    headerBg: '#252526',
    contentBg: '#181819',
    border: '#3D3D3D',
    titleColor: '#d4d4d4',
    countColor: '#666666',
    buttonColor: '#d4d4d4',
    buttonHoverBg: 'rgba(239, 239, 239, 0.1)',
    buttonHoverColor: '#ffffff',
    messageColor: '#d4d4d4',
    timestampColor: '#666666',
    emptyColor: '#666666',
    logHoverBg: 'rgba(239, 239, 239, 0.05)',
    resizeHandleHover: '#666666',
    resizeHandleActive: '#666666',
    dropdownBg: '#252526',
    dropdownHeaderBg: '#3D3D3D',
    optionHoverBg: 'rgba(239, 239, 239, 0.05)',
    optionLabelColor: '#d4d4d4',
    optionCountColor: '#666666',
    checkboxColor: '#666666',
    scrollbarTrack: '#252526',
    scrollbarThumb: '#666666',
    scrollbarThumbHover: '#d4d4d4'
  },

  gitUI: {
    border: '#3D3D3D',
    sidebar: {
      bg: '#181819'
    },
    button: {
      color: '#d4d4d4',
      hoverColor: '#d4d4d4',
      bg: '#252526'
    },
    branchOverview: {
      bg: '#181819',
      text: '#666666',
      branchSelector: {
        bg: '#252526'
      },
      checkUpdates: {
        bg: '#252526',
        border: '#252526'
      },
      commitCount: {
        color: '#d4d4d4'
      },
      button: {
        color: '#d4d4d4',
        hoverColor: '#d4d4d4',
        bg: '#252526'
      },
      seeCommits: {
        color: '#666666',
        hoverColor: '#d4d4d4'
      }
    },
    commitsAhead: {
      commitCount: {
        color: '#d4d4d4'
      },
      actionButton: {
        color: '#d4d4d4'
      }
    },
    commitsBehind: {
      commitCount: {
        color: '#d4d4d4'
      },
      actionButton: {
        color: '#d4d4d4'
      }
    },
    commitForm: {
      bg: '#181819',
      button: {
        bg: '#252526'
      }
    },
    commitFormInput: {
      bg: '#252526',
      color: '#666666'
    },
    changes: {
      sectionHeader: '#666666',
      countBadge: {
        bg: '#252526',
        color: '#666666'
      },
      actionButton: {
        color: '#666666',
        hoverBg: '#252526',
        hoverColor: '#d4d4d4'
      },
      border: '#252526',
      fileItem: {
        color: '#666666',
        hoverBg: '#3D3D3D',
        hoverColor: '#d4d4d4',
        actionButton: {
          color: '#666666',
          hoverBg: '#3D3D3D'
        }
      }
    }
  },

  grpc: {
    tabNav: {
      container: {
        bg: '#252526'
      },
      button: {
        active: {
          bg: '#3D3D3D',
          color: '#ffffff'
        },
        inactive: {
          bg: 'transparent',
          color: '#666666'
        }
      }
    },
    importPaths: {
      header: {
        text: '#666666',
        button: {
          color: '#666666',
          hoverColor: '#d4d4d4'
        }
      },
      error: {
        bg: 'transparent',
        text: '#252526',
        link: {
          color: '#252526',
          hoverColor: '#3D3D3D'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(239, 239, 239, 0.05)',
        text: '#d4d4d4',
        icon: '#666666',
        checkbox: {
          color: '#d4d4d4'
        },
        invalid: {
          opacity: 0.6,
          text: '#252526'
        }
      },
      empty: {
        text: '#666666'
      },
      button: {
        bg: '#252526',
        color: '#d4d4d4',
        border: '#252526',
        hoverBorder: '#666666'
      }
    },
    protoFiles: {
      header: {
        text: '#666666',
        button: {
          color: '#666666',
          hoverColor: '#d4d4d4'
        }
      },
      error: {
        bg: 'transparent',
        text: '#252526',
        link: {
          color: '#252526',
          hoverColor: '#3D3D3D'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(239, 239, 239, 0.05)',
        selected: {
          bg: '#666666',
          border: '#d4d4d4'
        },
        text: '#d4d4d4',
        secondaryText: '#666666',
        icon: '#666666',
        invalid: {
          opacity: 0.6,
          text: '#252526'
        }
      },
      empty: {
        text: '#666666'
      },
      button: {
        bg: '#252526',
        color: '#d4d4d4',
        border: '#252526',
        hoverBorder: '#666666'
      }
    }
  },
  deprecationWarning: {
    bg: '#252526',
    border: '#252526',
    icon: '#3D3D3D',
    text: '#666666'
  },

  trial: {
    text: '#fff',

    success: '#d4d4d4',

    accent: '#d4d4d4',
    onAccent: '#181819',

    surface: '#181819',
    onSurface: '#d4d4d4',

    overlay: '#252526',
    onOverlay: '#ffffff',

    muted: '#666666',
    onMuted: '#181819',

    subtle: '#d4d4d4',

    highlightLow: '#3D3D3D',
    highlightMid: '#666666'
  },

  preferences: {
    sidebar: {
      border: '#3D3D3D'
    }
  },

  examples: {
    buttonBg: '#666666',
    buttonColor: '#ffffff',
    buttonText: '#fff',
    buttonIconColor: '#fff',
    border: '#3D3D3D',
    urlBar: {
      border: '#3D3D3D',
      bg: '#181819'
    },
    table: {
      thead: {
        bg: '#181819',
        color: '#666666'
      }
    },
    checkbox: {
      color: '#181819'
    }
  }
};

export default reaperTheme;
