const colors = {
  BRAND: '#ffbb88',
  TEXT: '#868690',
  TEXT_LINK: '#fdfdfe',
  BACKGROUND: '#0F1014',

  GRAY_1: '#575861',
  GRAY_2: '#43444D',
  GRAY_3: '#111216',

  CODEMIRROR_TOKENS: {
    DEFINITION: '#ffbb88', // Softer, brighter sage — better contrast
    PROPERTY: '#c58fff', // Soft sky blue, high clarity without being loud
    STRING: '#9898a6', // VSCode-like warm string tone
    NUMBER: '#ffbb88', // Standard teal with higher clarity
    ATOM: '#8eb6f5', // Brighter lavender, matches VSCode purple
    VARIABLE: '#ffbb88', // Clear aqua-blue (used widely in dark themes)
    KEYWORD: '#8eb6f5', // Coral-ish but muted to avoid eye strain
    COMMENT: '#43444D', // Greenish-slate — very readable & subtle
    OPERATOR: '#575861' // Light gray — consistent with dark mode operators
  }
};

const sequoiaTheme = {
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
      white: '#fdfdfe',
      green: '#8eb6f5',
      danger: '#f58ee0',
      muted: '#575861',
      purple: '#c58fff',
      yellow: '#ffbb88',
      darkOrange: '#9898a6'
    },
    bg: {
      lightYellow: '#43444D',
      danger: '#111216'
    }
  },

  listItem: {
    hoverBg: '#817c9c14',
    activeBg: '#817c9c26'
  },

  input: {
    bg: '#13131780',
    border: '#817c9c26',
    focusBorder: '#817c9c26',
    placeholder: {
      color: '#575861',
      opacity: 0.75
    }
  },

  variables: {
    bg: '#111216',

    name: {
      color: '#868690'
    },

    runtime: {
      color: '#fdfdfe'
    }
  },

  menubar: {
    bg: '#111216'
  },

  info: {
    bg: '#111216',
    color: '#868690',
    border: '#43444D'
  },
  sidebar: {
    color: '#868690',
    muted: '#575861',
    bg: colors.BACKGROUND,
    dragbar: {
      border: 'transparent',
      activeBorder: colors.GRAY_1
    },

    badge: {
      bg: '#43444D'
    },

    search: {
      border: '1px solid transparent',
      bg: '#43444D'
    },

    collection: {
      item: {
        bg: '#111216',
        hoverBg: colors.BACKGROUND,
        keyboardFocusBg: 'rgba(134, 134, 144, 0.2)',
        indentBorder: 'solid 1px #575861',
        active: {
          indentBorder: 'solid 1px #43444D'
        }
      }
    },

    dropdownIcon: {
      color: '#868690'
    }
  },

  welcome: {
    heading: '#868690',
    muted: '#575861'
  },

  dropdown: {
    color: '#868690',
    iconColor: '#868690',
    bg: '#111216',
    hoverBg: '#43444D',
    shadow: 'rgb(0 0 0 / 36%) 0px 2px 8px',
    separator: '#43444D',
    labelBg: '#111216',
    selectedBg: '#817c9c26',
    selectedColor: '#fdfdfe',
    mutedText: '#575861',
    primaryText: '#868690',
    secondaryText: '#575861',
    headingText: '#fdfdfe'
  },

  listItem: {
    hoverBg: '#817c9c14',
    activeBg: '#817c9c26'
  },

  workspace: {
    accent: '#ffbb88',
    border: '#43444D',
    borderMuted: '#575861',
    card: {
      bg: '#111216'
    },
    button: {
      bg: '#0F1014'
    },
    collection: {
      header: {
        indentBorder: 'solid 1px #43444D'
      },
      item: {
        indentBorder: 'solid 1px #111216'
      }
    },
    environments: {
      bg: '#0F1014',
      indentBorder: 'solid 1px #111216',
      activeBg: '#111216',
      search: {
        bg: '#43444D'
      }
    }
  },

  request: {
    methods: {
      get: '#868690',
      post: '#868690',
      put: '#868690',
      delete: '#f58ee0',
      // customize these colors if needed
      patch: '#868690',
      options: '#868690',
      head: '#868690'
    },
    grpc: '#868690',
    ws: '#868690',
    gql: '#868690'
  },

  requestTabPanel: {
    url: {
      bg: colors.BACKGROUND,
      icon: '#868690',
      iconDanger: '#f58ee0',
      errorHoverBg: '#0F1014',
      border: `solid 1px ${colors.GRAY_2}`
    },
    dragbar: {
      border: '#43444D',
      activeBorder: '#575861'
    },
    bodyModeSelect: {
      color: 'transparent'
    },
    responseSendIcon: '#575861',
    responseStatus: '#868690',
    responseOk: '#8eb6f5',
    responseError: '#f58ee0',
    responsePending: '#ffbb88',
    responseOverlayBg: 'rgba(15, 16, 20, 0.6)',

    card: {
      bg: '#111216',
      border: 'transparent',
      borderDark: '#868690',
      hr: '#43444D'
    },

    cardTable: {
      border: '#111216',
      bg: '#111216',
      table: {
        thead: {
          bg: '#43444D',
          color: '#868690'
        }
      }
    },
    graphqlDocsExplorer: {
      bg: '#0F1014',
      color: '#868690'
    }
  },

  collection: {
    environment: {
      bg: '#43444D',

      settings: {
        bg: '#43444D',
        sidebar: {
          bg: '#43444D',
          borderRight: '#575861'
        },
        item: {
          border: '#868690',
          hoverBg: 'transparent',
          active: {
            bg: 'transparent',
            hoverBg: 'transparent'
          }
        },
        gridBorder: '#575861'
      }
    }
  },

  notifications: {
    bg: '#43444D',
    list: {
      bg: '#43444D',
      borderRight: '#575861',
      borderBottom: '#575861',
      hoverBg: '#111216',
      active: {
        border: '#868690',
        bg: '#817c9c26',
        hoverBg: '#817c9c26'
      }
    }
  },

  modal: {
    title: {
      color: '#868690',
      bg: '#111216',
      iconColor: '#868690'
    },
    body: {
      color: '#868690',
      bg: '#111216'
    },
    input: {
      bg: '#43444D',
      border: '#43444D',
      focusBorder: '#43444D'
    },
    backdrop: {
      opacity: 0.2
    }
  },

  button: {
    secondary: {
      color: '#868690',
      bg: '#111216',
      border: '#111216',
      hoverBorder: '#575861'
    },
    close: {
      color: '#868690',
      bg: 'transparent',
      border: 'transparent',
      hoverBorder: ''
    },
    disabled: {
      color: '#575861',
      bg: '#111216',
      border: '#111216'
    },
    danger: {
      color: '#f58ee0',
      bg: '#0F1014',
      border: '#0F1014'
    }
  },

  tabs: {
    active: {
      color: '#868690',
      border: '#868690'
    },
    secondary: {
      active: {
        bg: '#111216',
        color: '#868690'
      },
      inactive: {
        bg: '#43444D',
        color: '#868690'
      }
    }
  },

  requestTabs: {
    color: '#868690',
    bg: '#111216',
    bottomBorder: '#43444D',
    icon: {
      color: '#575861',
      hoverColor: '#868690',
      hoverBg: '#0F1014'
    },
    active: {
      bg: '#43444D'
    },
    shortTab: {
      color: '#868690',
      bg: 'transparent',
      hoverColor: '#868690',
      hoverBg: '#43444D'
    }
  },

  codemirror: {
    bg: colors.BACKGROUND,
    border: colors.BACKGROUND,
    placeholder: {
      color: '#575861',
      opacity: 0.5
    },
    gutter: {
      bg: colors.BACKGROUND
    },
    variable: {
      valid: '#868690',
      invalid: '#f58ee0',
      prompt: '#575861',
      info: {
        color: '#fdfdfe',
        bg: '#111216',
        boxShadow: 'rgb(0 0 0 / 36%) 0px 2px 8px',
        editorBg: '#0F1014',
        iconColor: '#575861',
        editorBorder: '#43444D',
        editorFocusBorder: '#868690',
        editableDisplayHoverBg: 'rgba(253,253,254,0.03)',
        border: '#575861',
        editorBorder: '#43444D'
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
    searchLineHighlightCurrent: 'rgba(134,134,144,0.18)',
    searchMatch: '#fdfdfe',
    searchMatchActive: '#fdfdfe'
  },

  table: {
    border: '#111216',
    thead: {
      color: '#868690'
    },
    striped: '#111216',
    input: {
      color: '#868690'
    }
  },

  plainGrid: {
    hoverBg: '#43444D'
  },

  scrollbar: {
    color: '#111216'
  },

  preferences: {
    sidebar: {
      bg: '#0F1014',
      borderRight: 'transparent'
    }
  },

  dragAndDrop: {
    border: '#575861',
    borderStyle: '2px solid',
    hoverBg: 'rgba(134, 134, 144, 0.08)',
    transition: 'all 0.1s ease'
  },

  tooltip: {
    bg: '#0F1014',
    color: '#fdfdfe',
    shortcutColor: '#868690'
  },

  infoTip: {
    bg: '#0F1014',
    border: '#111216',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
  },

  statusBar: {
    border: '#111216',
    color: '#575861'
  },

  console: {
    bg: '#0F1014',
    headerBg: '#111216',
    contentBg: '#0F1014',
    border: '#43444D',
    titleColor: '#868690',
    countColor: '#575861',
    buttonColor: '#868690',
    buttonHoverBg: 'rgba(253, 253, 254, 0.1)',
    buttonHoverColor: '#fdfdfe',
    messageColor: '#868690',
    timestampColor: '#575861',
    emptyColor: '#575861',
    logHoverBg: 'rgba(253, 253, 254, 0.05)',
    resizeHandleHover: '#575861',
    resizeHandleActive: '#575861',
    dropdownBg: '#111216',
    dropdownHeaderBg: '#43444D',
    optionHoverBg: 'rgba(253, 253, 254, 0.05)',
    optionLabelColor: '#868690',
    optionCountColor: '#575861',
    checkboxColor: '#575861',
    scrollbarTrack: '#111216',
    scrollbarThumb: '#575861',
    scrollbarThumbHover: '#868690'
  },

  gitUI: {
    border: '#43444D',
    sidebar: {
      bg: '#0F1014'
    },
    button: {
      color: '#868690',
      hoverColor: '#868690',
      bg: '#111216'
    },
    branchOverview: {
      bg: '#0F1014',
      text: '#575861',
      branchSelector: {
        bg: '#111216'
      },
      checkUpdates: {
        bg: '#111216',
        border: '#111216'
      },
      commitCount: {
        color: '#868690'
      },
      button: {
        color: '#868690',
        hoverColor: '#868690',
        bg: '#111216'
      },
      seeCommits: {
        color: '#575861',
        hoverColor: '#868690'
      }
    },
    commitsAhead: {
      commitCount: {
        color: '#868690'
      },
      actionButton: {
        color: '#868690'
      }
    },
    commitsBehind: {
      commitCount: {
        color: '#868690'
      },
      actionButton: {
        color: '#868690'
      }
    },
    commitForm: {
      bg: '#0F1014',
      button: {
        bg: '#111216'
      }
    },
    commitFormInput: {
      bg: '#111216',
      color: '#575861'
    },
    changes: {
      sectionHeader: '#575861',
      countBadge: {
        bg: '#111216',
        color: '#575861'
      },
      actionButton: {
        color: '#575861',
        hoverBg: '#111216',
        hoverColor: '#868690'
      },
      border: '#111216',
      fileItem: {
        color: '#575861',
        hoverBg: '#43444D',
        hoverColor: '#868690',
        actionButton: {
          color: '#575861',
          hoverBg: '#43444D'
        }
      }
    }
  },

  grpc: {
    tabNav: {
      container: {
        bg: '#111216'
      },
      button: {
        active: {
          bg: '#43444D',
          color: '#fdfdfe'
        },
        inactive: {
          bg: 'transparent',
          color: '#575861'
        }
      }
    },
    importPaths: {
      header: {
        text: '#575861',
        button: {
          color: '#575861',
          hoverColor: '#868690'
        }
      },
      error: {
        bg: 'transparent',
        text: '#f58ee0',
        link: {
          color: '#f58ee0',
          hoverColor: '#f58ee0'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(253, 253, 254, 0.05)',
        text: '#868690',
        icon: '#575861',
        checkbox: {
          color: '#868690'
        },
        invalid: {
          opacity: 0.6,
          text: '#f58ee0'
        }
      },
      empty: {
        text: '#575861'
      },
      button: {
        bg: '#111216',
        color: '#868690',
        border: '#111216',
        hoverBorder: '#575861'
      }
    },
    protoFiles: {
      header: {
        text: '#575861',
        button: {
          color: '#575861',
          hoverColor: '#868690'
        }
      },
      error: {
        bg: 'transparent',
        text: '#f58ee0',
        link: {
          color: '#f58ee0',
          hoverColor: '#f58ee0'
        }
      },
      item: {
        bg: 'transparent',
        hoverBg: 'rgba(253, 253, 254, 0.05)',
        selected: {
          bg: '#817c9c26',
          border: '#868690'
        },
        text: '#868690',
        secondaryText: '#575861',
        icon: '#575861',
        invalid: {
          opacity: 0.6,
          text: '#f58ee0'
        }
      },
      empty: {
        text: '#575861'
      },
      button: {
        bg: '#111216',
        color: '#868690',
        border: '#111216',
        hoverBorder: '#575861'
      }
    }
  },
  deprecationWarning: {
    bg: '#111216',
    border: '#111216',
    icon: '#43444D',
    text: '#575861'
  },

  trial: {
    text: '#fdfdfe',

    success: '#8eb6f5',

    accent: '#ffbb88',
    onAccent: '#0F1014',

    surface: '#0F1014',
    onSurface: '#868690',

    overlay: '#111216',
    onOverlay: '#fdfdfe',

    muted: '#575861',
    onMuted: '#0F1014',

    subtle: '#868690',

    highlightLow: '#43444D',
    highlightMid: '#575861'
  },

  preferences: {
    sidebar: {
      border: '#43444D'
    }
  },

  examples: {
    buttonBg: '#575861',
    buttonColor: '#fdfdfe',
    buttonText: '#fdfdfe',
    buttonIconColor: '#fdfdfe',
    border: '#43444D',
    urlBar: {
      border: '#43444D',
      bg: '#0F1014'
    },
    table: {
      thead: {
        bg: '#0F1014',
        color: '#575861'
      }
    },
    checkbox: {
      color: '#0F1014'
    }
  }
};

export default sequoiaTheme;
