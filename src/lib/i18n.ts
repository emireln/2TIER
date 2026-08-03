export type Language = 'en' | 'pt-BR'

export interface TranslationDictionary {
  // Titlebar & Common
  appTitle: string
  untitledList: string
  undo: string
  redo: string
  addTier: string
  presets: string
  export: string
  hidePool: string
  showPool: string
  resetList: string
  myTierLists: string
  settings: string
  toggleTheme: string
  hideHeaderTitle: string
  showHeaderTitle: string
  confirmReset: string

  // Settings Drawer
  settingsTitle: string
  languageLabel: string
  interfacePreferences: string
  hideHeaderTitleDesc: string
  desktopSettings: string
  desktopOnlyTag: string
  startWithWindows: string
  startWithWindowsDesc: string
  alwaysOnTop: string
  alwaysOnTopDesc: string
  defaultExportSettings: string
  defaultScale: string
  includeWatermark: string
  saveSettings: string

  // Item Pool
  unassignedPool: string
  itemsCount: string
  loadDemoImages: string
  bulkUpload: string
  clearPool: string
  confirmClearPool: string
  dragDropHint: string

  // Tier Rows & Cards
  dragDropRowHint: string
  moveRowUp: string
  moveRowDown: string
  rowOptions: string
  addRowAbove: string
  addRowBelow: string
  clearRow: string
  deleteRow: string
  changeRowColor: string
  clickToEditLabel: string
  previewImage: string
  deleteItem: string

  // Drawers
  exportSettingsTitle: string
  imageFormat: string
  renderResolution: string
  includeTitleHeader: string
  saveHighResImage: string
  exportSuccess: string
  mySavedTierLists: string
  saveCurrentList: string
  saveCurrentListToCollection: string
  listSavedSuccess: string
  noSavedLists: string
  openProject: string
  editDetails: string
  deleteProject: string
  confirmDeleteProject: string
  newCustomTemplate: string
  saveBoardAsTemplate: string
  defaultPresets: string
  myCustomTemplates: string
  deleteTemplate: string
  resetToDefaultTemplate: string
  templateNamePlaceholder: string
  templateDescPlaceholder: string
  saveTemplateBtn: string
  cancelBtn: string
}

export const detectDeviceLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('2tier_language')
    if (saved === 'pt-BR' || saved === 'en') {
      return saved
    }
    const navLang = typeof navigator !== 'undefined' ? (navigator.language || (navigator as any).userLanguage || '') : ''
    if (navLang.toLowerCase().startsWith('pt')) {
      return 'pt-BR'
    }
  } catch (e) {}
  return 'en'
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: '2TIER',
    untitledList: 'Untitled Tier List',
    undo: 'Undo',
    redo: 'Redo',
    addTier: 'Add Tier',
    presets: 'Presets',
    export: 'Export',
    hidePool: 'Hide Pool',
    showPool: 'Show Pool',
    resetList: 'Reset Tier List',
    myTierLists: 'My Tier Lists',
    settings: 'Settings',
    toggleTheme: 'Toggle Theme',
    hideHeaderTitle: 'Hide Board Title Banner',
    showHeaderTitle: 'Show Board Title Banner',
    confirmReset: 'Reset tier list and start new?',

    settingsTitle: 'App Settings',
    languageLabel: 'Language / Idioma',
    interfacePreferences: 'Interface & Board Display',
    hideHeaderTitleDesc: 'Hide the title header banner inside the main tier board UI',
    desktopSettings: 'Desktop App Options',
    desktopOnlyTag: 'Desktop App Only',
    startWithWindows: 'Start 2TIER with Windows',
    startWithWindowsDesc: 'Automatically launch 2TIER on system startup',
    alwaysOnTop: 'Keep Window Always on Top',
    alwaysOnTopDesc: 'Keep 2TIER floating above all other desktop windows',
    defaultExportSettings: 'Export Defaults',
    defaultScale: 'Default Export Scale',
    includeWatermark: "Include 2TIER Watermark by Default",
    saveSettings: 'Save Settings',

    unassignedPool: 'Unassigned Pool',
    itemsCount: 'items',
    loadDemoImages: 'Load Demo Images',
    bulkUpload: 'Bulk Upload',
    clearPool: 'Clear Pool',
    confirmClearPool: 'Clear all unassigned items?',
    dragDropHint: 'Drop image files here, paste from clipboard (Ctrl+V), or click Bulk Upload.',

    dragDropRowHint: 'Drag & drop items here',
    moveRowUp: 'Move Row Up',
    moveRowDown: 'Move Row Down',
    rowOptions: 'Row Options',
    addRowAbove: 'Add Row Above',
    addRowBelow: 'Add Row Below',
    clearRow: 'Clear Row',
    deleteRow: 'Delete Row',
    changeRowColor: 'Change row color',
    clickToEditLabel: 'Click to edit label',
    previewImage: 'Preview Image',
    deleteItem: 'Delete Item',

    exportSettingsTitle: 'Export Image Settings',
    imageFormat: 'Image Format',
    renderResolution: 'Render Resolution',
    includeTitleHeader: 'Include Title Header in Image',
    saveHighResImage: 'Save High-Res Image',
    exportSuccess: 'Tier list exported successfully!',
    mySavedTierLists: 'My Saved Tier Lists',
    saveCurrentList: 'Save Current Tier List',
    saveCurrentListToCollection: 'Save "{title}" to My Tier Lists',
    listSavedSuccess: 'Tier list saved to collection!',
    noSavedLists: 'No saved tier lists yet. Click above to save your current list!',
    openProject: 'Open List',
    editDetails: 'Edit details',
    deleteProject: 'Remove tier list',
    confirmDeleteProject: 'Delete "{title}" from saved list?',
    newCustomTemplate: 'New Custom Template',
    saveBoardAsTemplate: 'Save Current Board as Template',
    defaultPresets: 'Default Presets',
    myCustomTemplates: 'My Custom Templates',
    deleteTemplate: 'Delete Custom Template',
    resetToDefaultTemplate: 'Reset Board to Default',
    templateNamePlaceholder: 'Template Name (e.g., Anime Tier)',
    templateDescPlaceholder: 'Description (optional)',
    saveTemplateBtn: 'Save Template',
    cancelBtn: 'Cancel',
  },

  'pt-BR': {
    appTitle: '2TIER',
    untitledList: 'Tier List Sem Nome',
    undo: 'Desfazer',
    redo: 'Refazer',
    addTier: 'Adicionar Tier',
    presets: 'Modelos',
    export: 'Exportar',
    hidePool: 'Ocultar Pool',
    showPool: 'Mostrar Pool',
    resetList: 'Resetar Lista',
    myTierLists: 'Minhas Tier Lists',
    settings: 'Configurações',
    toggleTheme: 'Alternar Tema',
    hideHeaderTitle: 'Ocultar Título no Board UI',
    showHeaderTitle: 'Mostrar Título no Board UI',
    confirmReset: 'Resetar a tier list e começar uma nova?',

    settingsTitle: 'Configurações do Aplicativo',
    languageLabel: 'Idioma / Language',
    interfacePreferences: 'Preferências de Interface do Board',
    hideHeaderTitleDesc: 'Ocultar o banner com o título da lista na área principal do board',
    desktopSettings: 'Opções do Aplicativo Desktop',
    desktopOnlyTag: 'Apenas no App Desktop',
    startWithWindows: 'Iniciar 2TIER com o Windows',
    startWithWindowsDesc: 'Abrir o 2TIER automaticamente ao ligar o computador',
    alwaysOnTop: 'Manter Janela Sempre no Topo',
    alwaysOnTopDesc: 'Manter o 2TIER sobreposto acima de todas as outras janelas',
    defaultExportSettings: 'Padrões de Exportação',
    defaultScale: 'Resolução Padrão de Exportação',
    includeWatermark: "Incluir Marca D'água 2TIER por Padrão",
    saveSettings: 'Salvar Configurações',

    unassignedPool: 'Pool de Itens Não Atribuídos',
    itemsCount: 'itens',
    loadDemoImages: 'Carregar Imagens Demo',
    bulkUpload: 'Upload em Massa',
    clearPool: 'Limpar Pool',
    confirmClearPool: 'Limpar todos os itens não atribuídos?',
    dragDropHint: 'Arraste e solte arquivos aqui, cole da área de transferência (Ctrl+V) ou clique em Upload em Massa.',

    dragDropRowHint: 'Arraste e solte os itens aqui',
    moveRowUp: 'Mover Linha para Cima',
    moveRowDown: 'Mover Linha para Baixo',
    rowOptions: 'Opções da Linha',
    addRowAbove: 'Adicionar Linha Acima',
    addRowBelow: 'Adicionar Linha Abaixo',
    clearRow: 'Limpar Linha',
    deleteRow: 'Excluir Linha',
    changeRowColor: 'Alterar cor da linha',
    clickToEditLabel: 'Clique para editar o nome',
    previewImage: 'Visualizar Imagem',
    deleteItem: 'Excluir Item',

    exportSettingsTitle: 'Configurações de Exportação',
    imageFormat: 'Formato da Imagem',
    renderResolution: 'Resolução de Renderização',
    includeTitleHeader: 'Incluir Título do Projeto na Imagem',
    saveHighResImage: 'Salvar Imagem em Alta Resolução',
    exportSuccess: 'Tier list exportada com sucesso!',
    mySavedTierLists: 'Minhas Tier Lists Salvas',
    saveCurrentList: 'Salvar Tier List Atual',
    saveCurrentListToCollection: 'Salvar "{title}" em Minhas Tier Lists',
    listSavedSuccess: 'Tier list salva na coleção!',
    noSavedLists: 'Nenhuma tier list salva ainda. Clique acima para salvar a atual!',
    openProject: 'Abrir Lista',
    editDetails: 'Editar detalhes',
    deleteProject: 'Remover tier list',
    confirmDeleteProject: 'Excluir "{title}" da lista de salvas?',
    newCustomTemplate: 'Novo Modelo Customizado',
    saveBoardAsTemplate: 'Salvar Board Atual como Modelo',
    defaultPresets: 'Modelos Padrão',
    myCustomTemplates: 'Meus Modelos Customizados',
    deleteTemplate: 'Excluir Modelo Customizado',
    resetToDefaultTemplate: 'Resetar Board para o Padrão',
    templateNamePlaceholder: 'Nome do Modelo (ex: Tier de Animes)',
    templateDescPlaceholder: 'Descrição (opcional)',
    saveTemplateBtn: 'Salvar Modelo',
    cancelBtn: 'Cancelar',
  },
}
