interface PageTitleProps {
  text: string;
}

function PageTitle({ text }: PageTitleProps) {
  return <h1 className="page-title">{text}</h1>;
}

export default PageTitle;
