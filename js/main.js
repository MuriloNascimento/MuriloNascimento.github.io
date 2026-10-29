const content = window.siteContent || { projects: [], caseStudies: [] };

document.querySelector('#year').textContent = new Date().getFullYear();

function addText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  element.textContent = text;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function addDetail(parent, label, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) return;
  const detail = document.createElement('div');
  detail.className = 'project-detail';
  addText(detail, 'h4', label);
  addText(detail, 'p', Array.isArray(value) ? value.join(' · ') : value);
  parent.append(detail);
}

function addProjectLinks(parent, project) {
  const links = document.createElement('div');
  links.className = 'project-links';
  for (const [label, value] of [['Código-fonte', project.source], ['Demonstração', project.demo]]) {
    if (!value || !/^https?:\/\//i.test(value)) continue;
    const link = document.createElement('a');
    link.href = value;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${label} ↗`;
    links.append(link);
  }
  if (links.childElementCount) parent.append(links);
}

function renderProjects() {
  const list = document.querySelector('#project-list');
  if (!content.projects?.length) return;
  list.replaceChildren();
  for (const project of content.projects) {
    const article = document.createElement('article');
    article.className = 'project-entry';
    addText(article, 'h3', project.name || 'Projeto sem título');
    if (project.description) addText(article, 'p', project.description, 'project-description');
    const details = [
      ['Problema', project.problem], ['Funcionalidades', project.features],
      ['Tecnologias', project.technologies], ['Decisões técnicas', project.decisions],
      ['Testes e verificações', project.tests], ['Aprendizados', project.learnings],
      ['Limitações conhecidas', project.limitations]
    ];
    for (const [label, value] of details) addDetail(article, label, value);
    addProjectLinks(article, project);
    list.append(article);
  }
}

function renderCaseStudies() {
  const list = document.querySelector('#case-list');
  if (!content.caseStudies?.length) return;
  document.querySelector('#case-empty').hidden = true;
  list.replaceChildren();
  const labels = [
    ['Contexto', 'context'], ['Problema', 'problem'], ['Restrições e requisitos', 'constraints'],
    ['Alternativas consideradas', 'alternatives'], ['Solução escolhida', 'solution'],
    ['Justificativas técnicas', 'rationale'], ['Benefícios e desvantagens', 'tradeoffs'],
    ['Possíveis evoluções', 'nextSteps'], ['O que aprendi com a análise', 'learnings']
  ];
  for (const study of content.caseStudies) {
    const article = document.createElement('article');
    article.className = 'case-entry';
    addText(article, 'p', study.type || 'Estudo de caso', 'case-type');
    addText(article, 'h3', study.title || 'Estudo de caso sem título');
    for (const [label, key] of labels) addDetail(article, label, study[key]);
    list.append(article);
  }
}

function setupScrollReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, activeObserver) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      activeObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  document.querySelectorAll('.content-section, .contact-section').forEach((section) => {
    section.classList.add('scroll-reveal');
    observer.observe(section);
  });
}

renderProjects();
renderCaseStudies();
setupScrollReveal();
