type X = number;
type Y = number;
export type PixelPositionMatrix = [ X[],
                                    Y[],
                                    1[] ];

type Tx = number;
type Ty = number;
export type TranslationMatrix = [ [  1,  0, Tx ],
                                  [  0,  1, Ty ],
                                  [  0,  0,  1 ] ];

type Sx = number;
type Sy = number;
export type ScaleMatrix = [ [ Sx,  0,  0 ],
                            [  0, Sy,  0 ],
                            [  0,  0,  1 ] ];

type Cos = number;
type Sin = number;
export type RotationMatrix = [ [ Cos, Sin, 0 ],
                               [ Sin, Cos, 0 ],
                               [   0,   0, 1 ] ];
type M = 1 | -1
export type MirrorMatrix = [ [ M, 0, 0 ],
                             [ 0, M, 0 ],
                             [ 0, 0, 1 ] ];